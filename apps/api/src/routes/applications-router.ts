import { Router, type Router as ExpressRouter } from "express";
import {
  createApplication,
  getApplications,
  getSummary,
  updateApplicationStatus,
} from "../controllers/application-controller";

export const applicationsRouter: ExpressRouter = Router();

applicationsRouter.post("/", createApplication);
applicationsRouter.get("/", getApplications);
applicationsRouter.patch("/:id/status", updateApplicationStatus);
applicationsRouter.get('/summary', getSummary)
