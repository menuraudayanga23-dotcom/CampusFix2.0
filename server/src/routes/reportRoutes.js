import express from "express";
import {
  createReport,
  listReports,
  getReportById
} from "../controllers/reportController.js";

const router = express.Router();

router.get("/", listReports);
router.get("/:id", getReportById);
router.post("/", createReport);

export default router;
