import api from './api';

class ReviewService {
  setToken(token) {
    api.setToken(token);
  }

  // Get all reviews
  async getAllReviews() {
    return await api.get('/reviews');
  }

  // Get reviews by menu item
  async getReviewsByMenuItem(menuItemId) {
    return await api.get(`/reviews/menu/${menuItemId}`);
  }

  // Delete a review
  async deleteReview(reviewId) {
    return await api.delete(`/reviews/${reviewId}`);
  }

  // Respond to a review (placeholder for future implementation)
  async respondToReview(reviewId, response) {
    // This would be implemented when we add response functionality
    return { success: true, message: 'Response recorded' };
  }
}

export default new ReviewService();