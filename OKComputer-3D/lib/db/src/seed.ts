import { db } from "./index";

async function seed() {
  console.log("Database is empty — no seed data.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
