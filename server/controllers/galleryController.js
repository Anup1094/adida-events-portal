import Gallery from "../models/Gallery.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= CREATE GALLERY IMAGE =================

export const createGalleryImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image.",
      });
    }

    const {
  title,
  category,
  description,
  isFeatured,
} = req.body;

    if (!title) {
      // Remove uploaded file if validation fails
      if (fs.existsSync(req.file.path)) {
  fs.unlinkSync(req.file.path);
}
      return res.status(400).json({
        success: false,
        message: "Please provide a title for the image.",
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const gallery = await Gallery.create({
  title,
  category: category || "Uncategorized",
  description: description || "",
  isFeatured: isFeatured === "true",
  image: imageUrl,
});
    res.status(201).json({
      success: true,
      message: "Image uploaded successfully.",
      image: gallery,
    });
  } catch (error) {
    // Clean up file on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        // ignore cleanup error
      }
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL GALLERY IMAGES =================

// ================= GET ALL GALLERY IMAGES =================

export const getGalleryImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: images.length,
      images,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ================= GET SINGLE GALLERY IMAGE =================

export const getGalleryImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found.",
      });
    }

    res.status(200).json({
      success: true,
      image,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ================= DELETE GALLERY IMAGE =================

export const deleteGalleryImage = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Image not found.",
      });
    }

    // Delete the file from uploads
    const filePath = path.join(
  process.cwd(),
  gallery.image.replace(/^\/+/, "")
);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await gallery.deleteOne();

    res.status(200).json({
      success: true,
      message: "Image deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update
export const updateGalleryImage = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Image not found.",
      });
    }

      gallery.title = req.body.title || gallery.title;
      gallery.category = req.body.category || gallery.category;
      gallery.description = req.body.description ?? gallery.description;

if (req.body.isFeatured !== undefined) {
  gallery.isFeatured = req.body.isFeatured === "true";
}

    if (req.file) {
      const oldImage = path.join(
  process.cwd(),
  gallery.image.replace(/^\/+/, "")
);

      if (fs.existsSync(oldImage)) {
        fs.unlinkSync(oldImage);
      }

      gallery.image = `/uploads/${req.file.filename}`;
    }

    await gallery.save();

    res.status(200).json({
      success: true,
      message: "Gallery image updated successfully.",
      image: gallery,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

