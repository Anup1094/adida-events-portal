import Service from "../models/Service.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= CREATE SERVICE =================

export const createService = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    let image = "";
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const service = await Service.create({
      title,
      description,
      category: category || "General",
      image,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully.",
      service,
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

// ================= GET ALL SERVICES =================

export const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET SINGLE SERVICE =================

export const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE SERVICE =================

export const updateService = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;

      // Delete old image
      const oldService = await Service.findById(req.params.id);
      if (oldService && oldService.image) {
        const oldPath = path.join(
  process.cwd(),
  oldService.image.replace(/^\/+/, "")
);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully.",
      service,
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

// ================= DELETE SERVICE =================

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    // Delete associated image
    if (service.image) {
      const filePath = path.join(
  process.cwd(),
  service.image.replace(/^\/+/, "")
);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: "Service deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

