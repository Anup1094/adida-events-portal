import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getSettings);
router.put("/", verifyToken, isAdmin, updateSettings);

export default router;
