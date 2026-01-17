import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import {
  getModerationQueue,
  takeModerationAction,
} from "../controllers/moderation.controller.js";

const router = express.Router();

router.get(
  "/queue",
  authenticateToken,
  requireRole("MODERATOR"),
  getModerationQueue
);

router.post(
  "/action",
  authenticateToken,
  requireRole("MODERATOR"),
  takeModerationAction
);

export default router;
