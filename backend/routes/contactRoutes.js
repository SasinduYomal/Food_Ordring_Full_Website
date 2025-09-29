const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
  deleteContactMessage
} = require('../controllers/contactController');

// Public route
router.route('/').post(createContactMessage);

// Admin routes
router.route('/').get(protect, admin, getAllContactMessages);
router.route('/:id').get(protect, admin, getContactMessageById);
router.route('/:id').put(protect, admin, updateContactMessageStatus);
router.route('/:id').delete(protect, admin, deleteContactMessage);

module.exports = router;