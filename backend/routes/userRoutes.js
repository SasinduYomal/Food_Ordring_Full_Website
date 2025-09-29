const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
  getAllUsers,
  updateUserStatus,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/profile/picture')
  .put(protect, updateProfilePicture);

// Admin routes
router.route('/')
  .get(protect, admin, getAllUsers);

router.route('/:id/status')
  .put(protect, admin, updateUserStatus);

module.exports = router;