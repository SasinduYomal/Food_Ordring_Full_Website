import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import './Navbar.css';

const Navbar = () => {
  const { getCartCount } = useCart();
  const { addToast } = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = getCartCount();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Check if user is logged in
  const isLoggedIn = !!user;

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-container')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showProfileMenu]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setShowProfileMenu(false);
  }, [location]);

  // Add scrolled class to navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      toggleProfileMenu();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      addToast('You have been logged out successfully', 'success');
      navigate('/');
    } catch (error) {
      addToast('Error logging out. Please try again.', 'error');
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Grill & Chill
        </Link>
        
        <button className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/menu" className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`}>
              Menu
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/reservations" className={`nav-link ${location.pathname === '/reservations' ? 'active' : ''}`}>
              Reservations
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
              Contact
            </Link>
          </li>
         
          <li className="nav-item">
            <Link to="/cart" className={`cart-link ${location.pathname === '/cart' ? 'active' : ''}`}>
              <span className="icon">🛒</span>
              Cart
              {cartCount > 0 && (
                <span className="cart-count">{cartCount}</span>
              )}
            </Link>
          </li>
          <li className="nav-item profile-container">
            <div className="profile-wrapper" onClick={handleProfileClick}>
              {isLoggedIn && user.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt="Profile" 
                  className="profile-image profile-picture"
                />
              ) : (
                <div className="profile-image">
                  👤
                </div>
              )}
            </div>
            {!isLoggedIn && showProfileMenu && (
              <div className={`profile-dropdown ${showProfileMenu ? 'show' : ''}`}>
                <Link to="/login" className="dropdown-link" onClick={() => setShowProfileMenu(false)}>
                  Login
                </Link>
                <Link to="/register" className="dropdown-link" onClick={() => setShowProfileMenu(false)}>
                  Register
                </Link>
              </div>
            )}
            {isLoggedIn && showProfileMenu && (
              <div className={`profile-dropdown ${showProfileMenu ? 'show' : ''}`}>
                <Link to="/profile" className="dropdown-link" onClick={() => setShowProfileMenu(false)}>
                  Profile
                </Link>
                <Link to="/orders" className="dropdown-link" onClick={() => setShowProfileMenu(false)}>
                  My Orders
                </Link>
                <button className="dropdown-link logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;