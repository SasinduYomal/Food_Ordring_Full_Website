import { useState, useEffect } from 'react';
import reservationService from '../../services/reservationService';
import './ManageReservations.css';

const ManageReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getAllReservations();
      setReservations(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Failed to fetch reservations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (id, newStatus) => {
    try {
      await reservationService.updateReservationStatus(id, newStatus);
      // Update the local state to reflect the change
      setReservations(prev => 
        prev.map(reservation => 
          reservation._id === id 
            ? { ...reservation, status: newStatus } 
            : reservation
        )
      );
    } catch (err) {
      console.error('Error updating reservation status:', err);
      // In a real app, you might want to show an error message to the user
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'pending';
      case 'Confirmed': return 'approved';
      case 'Cancelled': return 'declined';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="manage-reservations">
        <div className="reservations-header">
          <h1>Reservation Management</h1>
        </div>
        <div className="loading">Loading reservations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-reservations">
        <div className="reservations-header">
          <h1>Reservation Management</h1>
        </div>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="manage-reservations">
      <div className="reservations-header">
        <h1>Reservation Management</h1>
        <button className="refresh-btn" onClick={fetchReservations}>
          Refresh Reservations
        </button>
      </div>

      <div className="reservations-list">
        <h2>All Reservations</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Reservation ID</th>
                <th>Customer</th>
                <th>Date & Time</th>
                <th>Guests</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(reservation => (
                <tr key={reservation._id}>
                  <td>#{reservation._id.slice(-6)}</td>
                  <td>{reservation.name}</td>
                  <td>{new Date(reservation.date).toLocaleDateString()} {reservation.time}</td>
                  <td>{reservation.guests}</td>
                  <td>
                    <span className={`status ${getStatusClass(reservation.status)}`}>
                      {reservation.status}
                    </span>
                  </td>
                  <td>
                    {reservation.status === 'Pending' && (
                      <>
                        <button 
                          className="action-btn approve-btn"
                          onClick={() => updateReservationStatus(reservation._id, 'Confirmed')}
                        >
                          Confirm
                        </button>
                        <button 
                          className="action-btn decline-btn"
                          onClick={() => updateReservationStatus(reservation._id, 'Cancelled')}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageReservations;