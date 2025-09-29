import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Restaurant Name</h3>
          <p>Delivering delicious food and memorable dining experiences since 2023.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/menu">Menu</a></li>
            <li><a href="/reservations">Reservations</a></li>
            <li><a href="/orders">Orders</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>123 Restaurant Street</p>
          <p>City, State 12345</p>
          <p>Phone: (123) 456-7890</p>
          <p>Email: info@restaurant.com</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Restaurant Name. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;