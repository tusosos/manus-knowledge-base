import { Router, type IRouter } from "express";
import healthRouter from "./health";
import dashboardRouter from "./dashboard";
import tasksRouter from "./tasks";
import projectsRouter from "./projects";
import clientsRouter from "./clients";
import filamentsRouter from "./filaments";
import printJobsRouter from "./print_jobs";
import quotesRouter from "./quotes";
import analyticsRouter from "./analytics";
import filamentPricesRouter from "./filament_prices";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dashboardRouter);
router.use(tasksRouter);
router.use(projectsRouter);
router.use(clientsRouter);
router.use(filamentsRouter);
router.use(printJobsRouter);
router.use(quotesRouter);
router.use(analyticsRouter);
router.use(filamentPricesRouter);

export default router;
