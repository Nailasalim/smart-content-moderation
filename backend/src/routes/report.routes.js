import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import {
  reportContent,
  getAllReports,
  reviewReport,
  getReportsByContentStatus,
  getReportsByUser,
  getUserReports,
} from "../controllers/report.controller.js";

const router = express.Router();

router.post("/", authenticateToken, reportContent);

router.get("/user-reports", authenticateToken, getUserReports);
router.get("/my-reports", authenticateToken, getUserReports);

router.get("/", authenticateToken, requireRole("MODERATOR"), getAllReports);

router.get(
  "/by-status/:status",
  authenticateToken,
  requireRole("MODERATOR"),
  getReportsByContentStatus
);

router.patch(
  "/:id/review",
  authenticateToken,
  requireRole("MODERATOR"),
  reviewReport
);

router.get(
  "/user/:userId",
  authenticateToken,
  requireRole("MODERATOR"),
  getReportsByUser
);

export default router;
