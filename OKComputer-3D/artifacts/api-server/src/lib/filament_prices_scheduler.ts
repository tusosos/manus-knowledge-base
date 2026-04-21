import { getFilamentPrices } from "./filament_prices";
import { logger } from "./logger";

const REFRESH_HOUR = 6;
const REFRESH_MINUTE = 0;

function msUntilNextRun(now: Date): number {
  const next = new Date(now);
  next.setHours(REFRESH_HOUR, REFRESH_MINUTE, 0, 0);
  if (next.getTime() <= now.getTime()) {
    next.setDate(next.getDate() + 1);
  }
  return next.getTime() - now.getTime();
}

async function runRefresh(reason: string): Promise<void> {
  try {
    const result = await getFilamentPrices({ force: true });
    logger.info(
      { reason, source: result.source, count: result.deals.length },
      "filament-prices: scheduled refresh complete",
    );
  } catch (err) {
    logger.error(
      { reason, err: (err as Error).message },
      "filament-prices: scheduled refresh failed",
    );
  }
}

function armNextRun(): void {
  const delay = msUntilNextRun(new Date());
  const timer = setTimeout(() => {
    void runRefresh("daily").finally(() => {
      armNextRun();
    });
  }, delay);
  if (typeof timer.unref === "function") timer.unref();
  logger.info(
    { delayMs: delay, hour: REFRESH_HOUR, minute: REFRESH_MINUTE },
    "filament-prices: daily scheduler armed",
  );
}

export function startFilamentPricesScheduler(): void {
  void runRefresh("startup");
  armNextRun();
}
