import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import {
  createGalleryImage,
  getGalleryImages,
  getGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from "../controllers/galleryController.js";

import {
  verifyToken,
  isAdmin,
} from "../middleware/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File Filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only jpeg, jpg, png, gif, webp and svg images are allowed."
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});


// ================= PUBLIC ROUTES =================

// Get all gallery images
router.get("/", getGalleryImages);

// Get single gallery image
router.get("/:id", getGalleryImage);


// ================= ADMIN ROUTES =================

// Create gallery image
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("image"),
  createGalleryImage
);

// Update gallery image
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.single("image"),
  updateGalleryImage
);

// Delete gallery image
router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  deleteGalleryImage
);

export default router;