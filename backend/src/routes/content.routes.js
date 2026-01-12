import express from "express";
import { submitContent } from "../controllers/content.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protected route
router.post("/submit", authenticateToken, submitContent);

export default router;
