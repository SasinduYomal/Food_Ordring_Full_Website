const Review = require('../models/Review');
const MenuItem = require('../models/MenuItem');

// Get all reviews (admin only)
const getAllReviews = async (req, res) => {
  try {
    // Only admins can get all reviews
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('menuItem', 'name')
      .sort({ createdAt: -1 });
      
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews for a menu item
const getReviewsByMenuItem = async (req, res) => {
  try {
    const { menuItemId } = req.params;
    
    // Check if menu item exists
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    const reviews = await Review.find({ menuItem: menuItemId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
      
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new review
const createReview = async (req, res) => {
  try {
    const { menuItemId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id; // From auth middleware
    
    // Check if menu item exists
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    // Check if user has already reviewed this item
    const existingReview = await Review.findOne({ 
      menuItem: menuItemId, 
      user: userId 
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this item' });
    }
    
    // Create review
    const review = new Review({
      menuItem: menuItemId,
      user: userId,
      rating,
      comment
    });
    
    const createdReview = await review.save();
    
    // Populate user info before sending response
    await createdReview.populate('user', 'name');
    
    res.status(201).json(createdReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id; // From auth middleware
    
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user owns this review
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }
    
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    
    const updatedReview = await review.save();
    
    // Populate user info before sending response
    await updatedReview.populate('user', 'name');
    
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id; // From auth middleware
    
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user owns this review or is admin
    if (review.user.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }
    
    await review.deleteOne();
    
    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllReviews,
  getReviewsByMenuItem,
  createReview,
  updateReview,
  deleteReview
};