import Event from "../models/Event.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= DELETE IMAGE HELPER =================

const deleteImage = (imagePath) => {
  if (!imagePath) return;

  const filePath = path.join(__dirname, "..", imagePath);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// ================= CREATE EVENT =================

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      location,
      eventDate,
      price,
      status,
      isFeatured,
    } = req.body;

    if (
      !title ||
      !category ||
      !description ||
      !location ||
      !eventDate ||
      !price
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    let image = "";

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const event = await Event.create({
      title,
      category,
      description,
      location,
      eventDate,
      price,
      status,
      image,
      isFeatured:
        isFeatured === "true" ||
        isFeatured === true,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully.",
      event,
    });
  } catch (error) {
    if (req.file) {
      deleteImage(`/uploads/${req.file.filename}`);
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL EVENTS =================

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET SINGLE EVENT =================

export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE EVENT =================

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    let image = event.image;

    if (req.file) {
      deleteImage(event.image);
      image = `/uploads/${req.file.filename}`;
    }

    event.title = req.body.title || event.title;
    event.category = req.body.category || event.category;
    event.description = req.body.description || event.description;
    event.location = req.body.location || event.location;
    event.eventDate = req.body.eventDate || event.eventDate;
    event.price = req.body.price || event.price;
    event.status = req.body.status || event.status;
    event.image = image;

    if (req.body.isFeatured !== undefined) {
      event.isFeatured =
        req.body.isFeatured === "true" ||
        req.body.isFeatured === true;
    }

    await event.save();

    res.status(200).json({
      success: true,
      message: "Event updated successfully.",
      event,
    });
  } catch (error) {
    if (req.file) {
      deleteImage(`/uploads/${req.file.filename}`);
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE EVENT =================

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    deleteImage(event.image);

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: "Event deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};