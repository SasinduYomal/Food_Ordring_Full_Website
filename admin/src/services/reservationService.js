import api from './api';

class ReservationService {
  // Get all reservations (admin only)
  async getAllReservations() {
    return await api.get('/reservations');
  }

  // Get reservation by ID
  async getReservationById(id) {
    return await api.get(`/reservations/${id}`);
  }

  // Update reservation status
  async updateReservationStatus(id, status) {
    return await api.put(`/reservations/${id}/status`, { status });
  }

  // Delete reservation
  async deleteReservation(id) {
    return await api.delete(`/reservations/${id}`);
  }

  // Set token for authenticated requests
  setToken(token) {
    console.log('ReservationService: Setting token', token ? `${token.substring(0, 20)}...` : 'null');
    api.setToken(token);
  }

  // Remove token
  removeToken() {
    console.log('ReservationService: Removing token');
    api.removeToken();
  }
}

export default new ReservationService();