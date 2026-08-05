import express from "express";
import { getCustomers, getCustomer, deleteCustomer } from "../controllers/userController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All customer-management routes are Super Admin only.
router.get("/", verifyToken, isAdmin, getCustomers);
router.get("/:id", verifyToken, isAdmin, getCustomer);
router.delete("/:id", verifyToken, isAdmin, deleteCustomer);

export default router;
