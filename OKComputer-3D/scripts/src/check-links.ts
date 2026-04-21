import { readdir, readFile, stat } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type Finding = { url: string; file: string; line: number };
type Verdict = "ok" | "warn" | "broken";
type Result = Finding & {
  status: number | null;
  verdict: Verdict;
  error?: string;
};

// Statuses commonly returned by anti-bot defenses on otherwise-live pages.
const WARN_STATUSES = new Set([401, 403, 429, 451]);

function classify(status: number | null, error?: string): Verdict {
  if (status == null) return "broken";
  if (status >= 200 && status < 400) return "ok";
  if (WARN_STATUSES.has(status)) return "warn";
  return "broken";
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");
const DEFAULT_SCAN_DIRS = [
  "artifacts/print-hub/src",
  "artifacts/api-server/src",
];
const SCAN_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".md"]);
const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  "build",
  ".next",
  ".turbo",
  ".cache",
]);

const URL_REGEX = /https?:\/\/[^\s"'`<>)]+/g;
const TRAILING_PUNCT = /[.,;:!?)\]}]+$/;

const SKIP_HOST_SUBSTRINGS = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "example.com",
  "schema.org",
  "w3.org",
];

const CONCURRENCY = 8;
const TIMEOUT_MS = 15_000;
const USER_AGENT =
  "Mozilla/5.0 (compatible; PrintHubLinkChecker/1.0; +https://replit.com)";

async function* walk(dir: string): AsyncGenerator<string> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile()) {
      const dot = entry.name.lastIndexOf(".");
      if (dot >= 0 && SCAN_EXTENSIONS.has(entry.name.slice(dot))) {
        yield full;
      }
    }
  }
}

function cleanUrl(raw: string): string | null {
  let url = raw;
  // Strip trailing punctuation that's almost certainly not part of the URL.
  while (TRAILING_PUNCT.test(url)) {
    url = url.replace(TRAILING_PUNCT, "");
  }
  // Skip URLs that look like template literals with unresolved expressions.
  if (url.includes("${")) return null;
  if (url.length < 10) return null;
  try {
    const parsed = new URL(url);
    if (SKIP_HOST_SUBSTRINGS.some((h) => parsed.hostname.includes(h))) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

async function collectFindings(scanDirs: string[]): Promise<Finding[]> {
  const findings: Finding[] = [];
  const seen = new Map<string, Finding>(); // url -> first occurrence
  for (const rel of scanDirs) {
    const abs = resolve(ROOT, rel);
    try {
      await stat(abs);
    } catch {
      continue;
    }
    for await (const file of walk(abs)) {
      const content = await readFile(file, "utf8");
      const lines = content.split(/\r?\n/);
      lines.forEach((line, idx) => {
        const matches = line.match(URL_REGEX);
        if (!matches) return;
        for (const raw of matches) {
          const cleaned = cleanUrl(raw);
          if (!cleaned) continue;
          if (seen.has(cleaned)) continue;
          const finding: Finding = {
            url: cleaned,
            file: relative(ROOT, file),
            line: idx + 1,
          };
          seen.set(cleaned, finding);
          findings.push(finding);
        }
      });
    }
  }
  return findings;
}

async function fetchWithTimeout(
  url: string,
  method: "HEAD" | "GET",
): Promise<{ status: number }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method,
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,pl;q=0.8",
      },
    });
    return { status: res.status };
  } finally {
    clearTimeout(timer);
  }
}

async function checkOne(finding: Finding): Promise<Result> {
  let lastStatus: number | null = null;
  let lastError: string | undefined;
  try {
    const head = await fetchWithTimeout(finding.url, "HEAD");
    lastStatus = head.status;
    if (head.status >= 200 && head.status < 400) {
      return { ...finding, status: head.status, verdict: "ok" };
    }
  } catch (err) {
    lastError = (err as Error).message;
  }
  // Fallback to GET — some servers reject HEAD or rate-limit it.
  try {
    const get = await fetchWithTimeout(finding.url, "GET");
    lastStatus = get.status;
    lastError = undefined;
  } catch (err) {
    lastError = (err as Error).message;
  }
  return {
    ...finding,
    status: lastStatus,
    verdict: classify(lastStatus, lastError),
    error: lastError,
  };
}

async function runPool<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, idx: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (true) {
      const idx = cursor++;
      if (idx >= items.length) return;
      results[idx] = await worker(items[idx], idx);
    }
  });
  await Promise.all(runners);
  return results;
}

function parseArgs(argv: string[]): { dirs: string[]; json: boolean } {
  const dirs: string[] = [];
  let json = false;
  for (const arg of argv) {
    if (arg === "--json") json = true;
    else if (arg.startsWith("--")) continue;
    else dirs.push(arg);
  }
  return { dirs: dirs.length ? dirs : DEFAULT_SCAN_DIRS, json };
}

async function main() {
  const { dirs, json } = parseArgs(process.argv.slice(2));
  if (!json) {
    console.log(`[check-links] Scanning: ${dirs.join(", ")}`);
  }
  const findings = await collectFindings(dirs);
  if (!json) {
    console.log(`[check-links] Found ${findings.length} unique external URL(s).`);
  }
  if (findings.length === 0) {
    if (json) console.log(JSON.stringify({ checked: 0, results: [] }));
    return;
  }
  const results = await runPool(findings, CONCURRENCY, async (f) => {
    const r = await checkOne(f);
    if (!json) {
      const tag =
        r.verdict === "ok" ? "OK  " : r.verdict === "warn" ? "WARN" : "BAD ";
      const status = r.status ?? "ERR";
      const detail = r.error ? ` (${r.error})` : "";
      console.log(`  [${tag}] ${status} ${r.url}  -> ${r.file}:${r.line}${detail}`);
    }
    return r;
  });
  const broken = results.filter((r) => r.verdict === "broken");
  const warns = results.filter((r) => r.verdict === "warn");
  const ok = results.length - broken.length - warns.length;
  if (json) {
    console.log(
      JSON.stringify(
        {
          checked: results.length,
          ok,
          warn: warns.length,
          broken: broken.length,
          results,
        },
        null,
        2,
      ),
    );
  } else {
    console.log("");
    console.log(
      `[check-links] Summary: ${ok} OK / ${warns.length} warn / ${broken.length} broken`,
    );
    if (warns.length > 0) {
      console.log(
        "[check-links] Warnings (likely anti-bot block, verify in browser):",
      );
      for (const r of warns) {
        console.log(`  - ${r.status} ${r.url}  @ ${r.file}:${r.line}`);
      }
    }
    if (broken.length > 0) {
      console.log("[check-links] Broken links:");
      for (const r of broken) {
        const status = r.status ?? "ERR";
        const detail = r.error ? ` (${r.error})` : "";
        console.log(`  - ${status} ${r.url}  @ ${r.file}:${r.line}${detail}`);
      }
    }
  }
  if (broken.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("[check-links] Unexpected error:", err);
  process.exit(2);
});
