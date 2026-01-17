import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import {
  reportContent,
  getAllReports,
  reviewReport,
} from "../controllers/report.controller.js";

const router = express.Router();

router.post("/", authenticateToken, reportContent);

router.get("/", authenticateToken, requireRole("MODERATOR"), getAllReports);

router.patch(
  "/:id/review",
  authenticateToken,
  requireRole("MODERATOR"),
  reviewReport
);

export default router;
