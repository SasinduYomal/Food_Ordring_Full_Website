const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getAllReviews,
  getReviewsByMenuItem,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

// Public routes
router.route('/menu/:menuItemId').get(getReviewsByMenuItem);

// Admin routes
router.route('/').get(protect, admin, getAllReviews);

// Protected routes
router.route('/menu/:menuItemId').post(protect, createReview);
router.route('/:reviewId').put(protect, updateReview).delete(protect, deleteReview);

module.exports = router;