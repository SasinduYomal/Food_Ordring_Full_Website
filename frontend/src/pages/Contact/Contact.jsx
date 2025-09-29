import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import './Contact.css';

const Contact = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send the data to the backend
      await api.post('/contact', formData);
      
      addToast('Message sent successfully! We will get back to you soon.', 'success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      addToast('Failed to send message. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <header className="contact-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </header>

      <div className="contact-content">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <div className="contact-details">
            <div className="contact-item">
              <h3>📍 Address</h3>
              <p>123 Restaurant Street<br />Foodville, FK 12345</p>
            </div>
            
            <div className="contact-item">
              <h3>📞 Phone</h3>
              <p>+1 (555) 123-4567</p>
            </div>
            
            <div className="contact-item">
              <h3>✉️ Email</h3>
              <p>info@restaurant.com</p>
            </div>
            
            <div className="contact-item">
              <h3>🕒 Opening Hours</h3>
              <p>Monday - Friday: 11:00 AM - 10:00 PM<br />Saturday - Sunday: 10:00 AM - 11:00 PM</p>
            </div>
          </div>
          
          <div className="map-container">
            <h3>Find Us</h3>
            <div className="map-placeholder">
              <p>Interactive Map Would Appear Here</p>
            </div>
          </div>
        </div>
        
        <div className="contact-form-container">
          <h2>Send us a Message</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
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
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;