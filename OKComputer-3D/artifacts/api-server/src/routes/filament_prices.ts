import { Router, type IRouter } from "express";
import { getFilamentPrices, getFilamentPriceHistory } from "../lib/filament_prices";

const router: IRouter = Router();

router.get("/filament-prices", async (req, res): Promise<void> => {
  const force = req.query.force === "1" || req.query.force === "true";
  const payload = await getFilamentPrices({ force });
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.json(payload);
});

router.get("/filament-prices/history", async (req, res): Promise<void> => {
  const raw = req.query.days;
  const parsed = typeof raw === "string" ? Number.parseInt(raw, 10) : NaN;
  const days = Number.isFinite(parsed) && parsed > 0 && parsed <= 90 ? parsed : 30;
  const payload = await getFilamentPriceHistory(days);
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.json(payload);
});

export default router;
