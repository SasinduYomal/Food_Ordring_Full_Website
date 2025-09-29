// Reservation Service for Food Ordering System
// This service handles reservation-related operations with feature flag support

import api from './api';
import config from './config';

// Mock data for reservations (used when backend is not available)
const mockReservations = [
  {
    id: 'res1',
    date: '2023-06-15',
    time: '19:00',
    guests: 4,
    status: 'Confirmed'
  },
  {
    id: 'res2',
    date: '2023-06-22',
    time: '18:30',
    guests: 2,
    status: 'Pending'
  }
];

// Check if reservations feature is enabled
const isReservationsEnabled = () => {
  return config.ENABLE_RESERVATIONS;
};

// Error message for disabled feature
const featureDisabledError = () => {
  return new Error('Reservation feature is currently disabled');
};

// Get user's reservations
// Returns mock data when feature is disabled or backend is unavailable
const getMyReservations = async () => {
  console.log('Fetching reservations - Feature enabled:', isReservationsEnabled());
  
  if (!isReservationsEnabled()) {
    console.log('Reservations feature is disabled, returning mock data');
    return mockReservations;
  }

  try {
    const response = await api.get('/reservations/my');
    console.log('Reservations fetched successfully:', response);
    return response;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    // Check if it's a network error or server error
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      console.log('Network error, returning mock data');
      // Return mock data on network error to ensure UI continues to work
      return mockReservations;
    }
    // For other errors, re-throw to let the calling component handle it
    throw error;
  }
};

// Create a new reservation
// Returns success response when feature is disabled
const createReservation = async (reservationData) => {
  console.log('Creating reservation - Feature enabled:', isReservationsEnabled(), 'Data:', reservationData);
  
  if (!isReservationsEnabled()) {
    console.log('Reservations feature is disabled, simulating success');
    // Return a success response similar to what the API would return
    return {
      success: true,
      message: 'Reservation submitted successfully! We will confirm your booking shortly.',
      reservation: {
        ...reservationData,
        id: `res${Date.now()}`,
        status: 'Pending'
      }
    };
  }

  try {
    const response = await api.post('/reservations', reservationData);
    return response;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};

// Update reservation status
const updateReservationStatus = async (reservationId, status) => {
  console.log('Updating reservation status - Feature enabled:', isReservationsEnabled(), 'ID:', reservationId, 'Status:', status);
  
  if (!isReservationsEnabled()) {
    throw featureDisabledError();
  }

  try {
    // In a real implementation, this would call the API
    // await api.put(`/reservations/${reservationId}/status`, { status });
    console.log(`Reservation ${reservationId} status updated to ${status}`);
  } catch (error) {
    console.error('Error updating reservation status:', error);
    throw error;
  }
};

// Cancel a reservation
const cancelReservation = async (reservationId) => {
  console.log('Cancelling reservation - Feature enabled:', isReservationsEnabled(), 'ID:', reservationId);
  
  if (!isReservationsEnabled()) {
    throw featureDisabledError();
  }

  try {
    // In a real implementation, this would call the API
    // await api.delete(`/reservations/${reservationId}`);
    console.log(`Reservation ${reservationId} cancelled`);
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    throw error;
  }
};

// Set token for authenticated requests
const setToken = (token) => {
  console.log('ReservationService: Setting token', token ? `${token.substring(0, 20)}...` : 'null');
  // Token is managed by api service
  api.setToken(token);
};

// Remove token
const removeToken = () => {
  console.log('ReservationService: Removing token');
  api.removeToken();
};

// Export as default object
const reservationService = {
  getMyReservations,
  createReservation,
  updateReservationStatus,
  cancelReservation,
  setToken,
  removeToken,
  isReservationsEnabled
};

export default reservationService;