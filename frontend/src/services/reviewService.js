import api from './api';

class ReviewService {
  // Get all reviews for a menu item
  async getReviewsByMenuItem(menuItemId) {
    return await api.get(`/reviews/menu/${menuItemId}`);
  }

  // Create a new review
  async createReview(menuItemId, reviewData) {
    return await api.post(`/reviews/menu/${menuItemId}`, reviewData);
  }

  // Update a review
  async updateReview(reviewId, reviewData) {
    return await api.put(`/reviews/${reviewId}`, reviewData);
  }

  // Delete a review
  async deleteReview(reviewId) {
    return await api.delete(`/reviews/${reviewId}`);
  }
}

export default new ReviewService();