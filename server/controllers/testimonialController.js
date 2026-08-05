import Testimonial from "../models/Testimonial.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= CREATE TESTIMONIAL =================

export const createTestimonial = async (req, res) => {
  try {
    const { name, event, rating, review, status } = req.body;

    if (!name || !review) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    let image = "";
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const testimonial = await Testimonial.create({
      name,
      event: event || "",
      rating: Number(rating) || 5,
      review,
      status: status || "Published",
      image,
    });

    res.status(201).json({
      success: true,
      message: "Testimonial created successfully.",
      testimonial,
    });
  } catch (error) {
   if (req.file && fs.existsSync(req.file.path)) {
  fs.unlinkSync(req.file.path);
}
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL TESTIMONIALS =================

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET SINGLE TESTIMONIAL =================

export const getTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found.",
      });
    }

    res.status(200).json({
      success: true,
      testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE TESTIMONIAL =================

export const updateTestimonial = async (req, res) => {
  try {
    const { name, event, rating, review, status } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (event !== undefined) updateData.event = event;
    if (rating) updateData.rating = Number(rating);
    if (review) updateData.review = review;
    if (status) updateData.status = status;

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;

      // Delete old image
      const oldTestimonial = await Testimonial.findById(req.params.id);
      if (oldTestimonial && oldTestimonial.image) {
        const oldPath = path.join(
  process.cwd(),
  oldTestimonial.image.replace(/^\/+/, "")
);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Testimonial updated successfully.",
      testimonial,
    });
  } catch (error) {
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        // ignore
      }
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE TESTIMONIAL =================

export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found.",
      });
    }

    // Delete associated image
    if (testimonial.image) {
const filePath = path.join(
  process.cwd(),
  testimonial.image.replace(/^\/+/, "")
);      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await testimonial.deleteOne();

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

