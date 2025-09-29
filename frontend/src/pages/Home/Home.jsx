import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleOrderOnline = () => {
    navigate('/menu');
  };

  const handleMakeReservation = () => {
    navigate('/reservations');
  };

  return (
    <div className="home">
      {/* Hero Section with Enhanced Animation */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title animate-pop-in">Delicious Food, Delivered Fresh</h1>
            <p className="hero-subtitle animate-fade-in delay-1">Experience culinary excellence with our chef-crafted dishes made from locally sourced ingredients</p>
            <div className="hero-buttons">
              <button className="btn btn-primary animate-slide-in-left delay-2" onClick={handleOrderOnline}>
                Order Online
              </button>
              <button className="btn btn-secondary animate-slide-in-right delay-3" onClick={handleMakeReservation}>
                Make a Reservation
              </button>
            </div>
          </div>
        </div>
        <div className="hero-image animate-float">
          <div className="hero-dish dish-1 animate-swing"></div>
          <div className="hero-dish dish-2 animate-spin"></div>
          <div className="hero-dish dish-3 animate-wobble"></div>
        </div>
      </section>

      {/* Features Section with Enhanced Hover Effects */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title animate-fade-in-up">Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card animate-fade-in-up">
              <div className="feature-icon">
                <span className="icon">⏱️</span>
              </div>
              <h3>Fast Delivery</h3>
              <p>Hot food delivered to your doorstep in under 30 minutes or it's free</p>
            </div>
            <div className="feature-card animate-fade-in-up delay-1">
              <div className="feature-icon">
                <span className="icon">🌱</span>
              </div>
              <h3>Fresh Ingredients</h3>
              <p>We source only the freshest ingredients from local farms daily</p>
            </div>
            <div className="feature-card animate-fade-in-up delay-2">
              <div className="feature-icon">
                <span className="icon">👨‍🍳</span>
              </div>
              <h3>Expert Chefs</h3>
              <p>Our award-winning chefs create culinary masterpieces</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Dishes with Enhanced Animation */}
      <section className="popular-dishes">
        <div className="container">
          <h2 className="section-title animate-fade-in-up">Popular Dishes</h2>
          <div className="dish-grid">
            <div className="dish-card animate-zoom-in-out">
              <div className="dish-image-container">
                <div className="dish-image dish-1"></div>
              </div>
              <div className="dish-content">
                <h4>Truffle Pasta</h4>
                <p className="dish-description">Creamy pasta with black truffle and parmesan</p>
                <div className="dish-footer">
                  <span className="price">Rs 16.99</span>
                  <button className="btn btn-small">Add to Cart</button>
                </div>
              </div>
            </div>
            <div className="dish-card animate-zoom-in-out delay-1">
              <div className="dish-image-container">
                <div className="dish-image dish-2"></div>
              </div>
              <div className="dish-content">
                <h4>Grilled Salmon</h4>
                <p className="dish-description">Wild-caught salmon with lemon herb butter</p>
                <div className="dish-footer">
                  <span className="price">Rs 22.99</span>
                  <button className="btn btn-small">Add to Cart</button>
                </div>
              </div>
            </div>
            <div className="dish-card animate-zoom-in-out delay-2">
              <div className="dish-image-container">
                <div className="dish-image dish-3"></div>
              </div>
              <div className="dish-content">
                <h4>Quinoa Salad</h4>
                <p className="dish-description">Organic quinoa with seasonal vegetables</p>
                <div className="dish-footer">
                  <span className="price">Rs 12.99</span>
                  <button className="btn btn-small">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title animate-fade-in-up">What Our Customers Say</h2>
          <div className="testimonial-grid">
            <div className="testimonial-card animate-fade-in-left">
              <div className="testimonial-content">
                <p>"The best dining experience I've had in years. The food was exceptional and the service was impeccable."</p>
                <div className="testimonial-author">
                  <span className="author-name">Sarah Johnson</span>
                  <span className="author-title">Food Critic</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card animate-fade-in-right">
              <div className="testimonial-content">
                <p>"Their delivery service is lightning fast and the food arrives hot and fresh every time. Highly recommended!"</p>
                <div className="testimonial-author">
                  <span className="author-name">Michael Chen</span>
                  <span className="author-title">Regular Customer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title animate-pulse">Ready to Experience Culinary Excellence?</h2>
            <p className="cta-subtitle">Join thousands of satisfied customers enjoying our delicious food</p>
            <button className="btn btn-primary btn-large animate-bounce" onClick={handleOrderOnline}>
              Order Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;