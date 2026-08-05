// server/models/Contact.js
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    phone: {
        type: String,
        trim: true,
        default: ""
    },
    location: {
        type: String,
        trim: true,
        default: ""
    },
    message: { 
        type: String, 
        required: true 
    },
    status: {
        type: String,
        enum: ["New", "Contacted", "Resolved"],
        default: "New"
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt dates

export default mongoose.model('Contact', contactSchema);