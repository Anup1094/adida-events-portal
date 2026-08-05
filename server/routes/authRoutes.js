import express from "express";
import { adminLogin, registerCustomer, customerLogin } from "../controllers/authController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerCustomer);
router.post("/login", customerLogin);

router.post("/admin/login", adminLogin);

router.get("/admin-test", verifyToken, isAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin",
  });
});

export default router;