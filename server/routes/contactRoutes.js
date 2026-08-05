// server/routes/contactRoutes.js
import express from 'express';
import { 
  submitContactForm,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry
} from '../controllers/contactController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route: POST /api/contact/submit (public)
router.post('/submit', submitContactForm);

// ================= ADMIN ROUTES =================

// Get all enquiries
router.get('/', verifyToken, isAdmin, getEnquiries);

// Update enquiry status
router.patch('/:id/status', verifyToken, isAdmin, updateEnquiryStatus);

// Delete enquiry
router.delete('/:id', verifyToken, isAdmin, deleteEnquiry);

export default router;
