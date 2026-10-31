import express from "express";
import {
  createReport,
  deleteReport,
  getReportById,
  listReports,
  updateReport
} from "../controllers/reportController.js";
import authenticateUser from "../middleware/authenticateUser.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/", listReports);
router.get("/:id", getReportById);
router.post("/", createReport);
router.put("/:id", updateReport);
router.delete("/:id", deleteReport);

export default router;
