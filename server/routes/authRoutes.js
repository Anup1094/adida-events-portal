
import express from "express";
import { adminLogin, registerCustomer, customerLogin, getMyProfile, updateMyProfile } from "../controllers/authController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerCustomer);
router.post("/login", customerLogin);

router.post("/admin/login", adminLogin);

// ================= MY PROFILE (any logged-in user) =================

router.get("/me", verifyToken, getMyProfile);
router.put("/me", verifyToken, updateMyProfile);

router.get("/admin-test", verifyToken, isAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin",
  });
});

export default router;