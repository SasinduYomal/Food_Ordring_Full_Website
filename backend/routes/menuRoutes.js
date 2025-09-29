const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  getMenuItems,
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.route('/').get(getMenuItems);
router.route('/:id').get(getMenuItemById);

// Admin routes
router.route('/admin/all').get(getAllMenuItems);

// Routes with file upload support
router.route('/')
  .post(upload.single('image'), createMenuItem);
  
router.route('/:id')
  .put(upload.single('image'), updateMenuItem)
  .delete(deleteMenuItem);

module.exports = router;