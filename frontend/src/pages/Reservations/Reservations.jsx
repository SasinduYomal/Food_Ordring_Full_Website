import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import reservationService from '../../services/reservationService';
import Loading from '../../components/Loading/Loading';
import './Reservations.css';

const Reservations = () => {
  const [reservationData, setReservationData] = useState({
    date: '',
    time: '',
    guests: 2,
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = !!localStorage.getItem('token');
    if (!isLoggedIn) {
      addToast('Please log in to make a reservation', 'info');
      navigate('/login');
    }
  }, [navigate, addToast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await reservationService.createReservation(reservationData);
      console.log('Reservation response:', response);
      
      if (response.success) {
        addToast(response.message || 'Reservation submitted successfully!', 'success');
        // Reset form
        setReservationData({
          date: '',
          time: '',
          guests: 2,
          name: '',
          email: '',
          phone: ''
        });
      } else {
        addToast('Failed to submit reservation. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      addToast('Failed to submit reservation. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Sample available time slots
  const timeSlots = [
    '17:00', '17:30', '18:00', '18:30', 
    '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  // Sample table options
  const tableOptions = [
    { value: 2, label: '2 guests (Small table)' },
    { value: 4, label: '4 guests (Large table)' },
    { value: 6, label: '6 guests (Family table)' },
    { value: 8, label: '8 guests (Family table)' }
  ];

  if (loading) {
    return <Loading message="Reserving your table..." />;
  }

  return (
    <div className="reservations-page">
      <header className="reservations-header">
        <h1>Make a Reservation</h1>
        <p>Book your table in advance to ensure the best dining experience</p>
      </header>

      <div className="reservations-content">
        <div className="reservations-form-container">
          <form className="reservations-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={reservationData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Time</label>
              <select
                id="time"
                name="time"
                value={reservationData.time}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a time</option>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="guests">Number of Guests</label>
              <select
                id="guests"
                name="guests"
                value={reservationData.guests}
                onChange={handleInputChange}
                required
              >
                {tableOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={reservationData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={reservationData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={reservationData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="btn-reserve" disabled={loading}>
              Reserve Table
            </button>
          </form>
        </div>

        <div className="reservations-info">
          <div className="info-card">
            <h3>Opening Hours</h3>
            <p>Monday - Friday: 17:00 - 22:00</p>
            <p>Saturday - Sunday: 16:00 - 23:00</p>
          </div>

          <div className="info-card">
            <h3>Contact Info</h3>
            <p>Phone: (123) 456-7890</p>
            <p>Email: reservations@restaurant.com</p>
          </div>

          <div className="info-card">
            <h3>Reservation Policy</h3>
            <p>Please arrive within 15 minutes of your reservation time.</p>
            <p>Late arrivals may result in cancellation of your booking.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;