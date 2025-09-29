import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import orderService from '../../services/orderService';
import reservationService from '../../services/reservationService';
import './Profile.css';

const Profile = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { user, token, logout, updateUser } = useAuth(); // Added updateUser from destructuring
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    profilePicture: ''
  });
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    if (!user || !token) {
      console.log('No user or token found, redirecting to login');
      navigate('/login');
      return;
    }

    // Validate token format
    if (!token.startsWith('eyJ')) {
      console.log('Invalid token format, redirecting to login');
      addToast('Session invalid. Please log in again.', 'error');
      // Clear any invalid tokens
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      userService.removeToken();
      orderService.removeToken();
      navigate('/login');
      return;
    }

    // Check if user account is active
    if (user && user.isActive === false) {
      addToast('Your account has been deactivated. Please contact admin.', 'error');
      userService.logout();
      orderService.logout();
      navigate('/login');
      return;
    }

    console.log('User found:', user);
    console.log('Token found:', token ? `${token.substring(0, 20)}...` : 'null');

    const fetchData = async () => {
      try {
        // Small delay to ensure token is properly set
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Ensure token is set in API services
        console.log('Setting token in API services');
        userService.setToken(token);
        orderService.setToken(token);
        reservationService.setToken(token);
        
        // Fetch user profile
        console.log('Fetching user profile...');
        const profile = await userService.getProfile();
        
        // Check if user account is active
        if (profile.isActive === false) {
          addToast('Your account has been deactivated. Please contact admin.', 'error');
          userService.logout();
          orderService.logout();
          navigate('/login');
          return;
        }
        
        console.log('Profile fetched:', profile);
        setUserData({
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          address: profile.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
          },
          profilePicture: profile.profilePicture || ''
        });
        
        // Set preview image if profile picture exists
        if (profile.profilePicture) {
          setPreviewImage(profile.profilePicture);
        }

        // Fetch user orders
        console.log('Fetching user orders...');
        // Add additional debugging
        console.log('Token being used for orders fetch:', token ? `${token.substring(0, 20)}...` : 'null');
        const userOrders = await orderService.getMyOrders();
        console.log('User orders fetched:', userOrders);
        setOrders(userOrders);

        // Fetch user reservations from backend
        console.log('Fetching user reservations...');
        try {
          const userReservations = await reservationService.getMyReservations();
          console.log('User reservations fetched:', userReservations);
          // Ensure reservations is always an array
          setReservations(Array.isArray(userReservations) ? userReservations : []);
        } catch (reservationError) {
          console.error('Error fetching user reservations:', reservationError);
          // Set reservations to empty array on error to prevent UI issues
          setReservations([]);
          addToast('Failed to fetch reservations. Please try again later.', 'error');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        // Log more details about the error
        console.error('Error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name
        });
        
        // If it's an authorization error, redirect to login
        if (err.message.includes('Not authorized')) {
          addToast('Session expired. Please log in again.', 'error');
          // Clear any invalid tokens
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          userService.removeToken();
          orderService.removeToken();
          navigate('/login');
        } else {
          addToast('Failed to fetch profile data: ' + err.message, 'error');
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token, navigate]);

  // Refresh orders when the orders tab is selected
  useEffect(() => {
    const refreshOrders = async () => {
      if (activeTab === 'orders' && user && token) {
        try {
          console.log('Refreshing orders...');
          // Ensure token is set in API services
          userService.setToken(token);
          orderService.setToken(token);
          // Add additional debugging
          console.log('Token being used for orders refresh:', token ? `${token.substring(0, 20)}...` : 'null');
          const userOrders = await orderService.getMyOrders();
          console.log('Refreshed orders:', userOrders);
          setOrders(userOrders);
        } catch (err) {
          console.error('Error refreshing order history:', err);
          // Log more details about the error
          console.error('Error details:', {
            message: err.message,
            stack: err.stack,
            name: err.name
          });
          // If it's an authorization error, redirect to login
          if (err.message.includes('Not authorized')) {
            addToast('Session expired. Please log in again.', 'error');
            navigate('/login');
          } else {
            addToast('Failed to refresh order history: ' + err.message, 'error');
          }
        }
      }
    };

    refreshOrders();
  }, [activeTab, user, token, navigate]);

  // Refresh reservations when the reservations tab is selected
  useEffect(() => {
    const refreshReservations = async () => {
      if (activeTab === 'reservations' && user && token) {
        try {
          console.log('Refreshing reservations...');
          // Ensure token is set in API services
          userService.setToken(token);
          orderService.setToken(token);
          reservationService.setToken(token);
          // Add additional debugging
          console.log('Token being used for reservations refresh:', token ? `${token.substring(0, 20)}...` : 'null');
          const userReservations = await reservationService.getMyReservations();
          console.log('Refreshed reservations:', userReservations);
          // Ensure reservations is always an array
          setReservations(Array.isArray(userReservations) ? userReservations : []);
        } catch (err) {
          console.error('Error refreshing reservations:', err);
          // Log more details about the error
          console.error('Error details:', {
            message: err.message,
            stack: err.stack,
            name: err.name
          });
          // Set reservations to empty array on error to prevent UI issues
          setReservations([]);
          addToast('Failed to fetch reservations. Please try again later.', 'error');
        }
      }
    };

    refreshReservations();
  }, [activeTab, user, token]);

  // Listen for new orders being placed
  useEffect(() => {
    const handleOrderPlaced = () => {
      // If we're currently on the orders tab, refresh the orders
      if (activeTab === 'orders') {
        refreshOrders();
      }
    };

    const refreshOrders = async () => {
      if (user && token) {
        try {
          console.log('Refreshing orders due to orderPlaced event...');
          // Ensure token is set in API services
          userService.setToken(token);
          orderService.setToken(token);
          // Add additional debugging
          console.log('Token being used for orderPlaced refresh:', token ? `${token.substring(0, 20)}...` : 'null');
          const userOrders = await orderService.getMyOrders();
          console.log('Orders after refresh:', userOrders);
          setOrders(userOrders);
        } catch (err) {
          console.error('Error refreshing order history:', err);
          // Log more details about the error
          console.error('Error details:', {
            message: err.message,
            stack: err.stack,
            name: err.name
          });
          // If it's an authorization error, redirect to login
          if (err.message.includes('Not authorized')) {
            addToast('Session expired. Please log in again.', 'error');
            navigate('/login');
          } else {
            addToast('Failed to refresh order history: ' + err.message, 'error');
          }
        }
      }
    };

    window.addEventListener('orderPlaced', handleOrderPlaced);

    // Cleanup event listener
    return () => {
      window.removeEventListener('orderPlaced', handleOrderPlaced);
    };
  }, [activeTab, user, token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setUserData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        addToast('Please select a valid image file', 'error');
        return;
      }
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        addToast('Image size should be less than 2MB', 'error');
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setUserData(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      // Ensure token is set in API services
      userService.setToken(token);
      orderService.setToken(token);
      
      // Separate profile picture update from other profile data
      let updatedProfile;
      
      // If profile picture is being updated, do it separately to avoid large payloads
      if (userData.profilePicture !== user?.profilePicture) {
        // Update profile picture first
        const pictureUpdate = await userService.updateProfilePicture(userData.profilePicture);
        updatedProfile = pictureUpdate;
        
        // Then update other profile data
        const profileUpdate = await userService.updateProfile({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address
        });
        updatedProfile = profileUpdate;
      } else {
        // Update all profile data except picture
        updatedProfile = await userService.updateProfile({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address
        });
      }
      
      // Update the user context with the new data using the updateUser function
      const updatedUserData = {
        ...user,
        name: updatedProfile.name,
        email: updatedProfile.email,
        profilePicture: updatedProfile.profilePicture
      };
      
      updateUser(updatedUserData);
      
      setUserData({
        name: updatedProfile.name,
        email: updatedProfile.email,
        phone: updatedProfile.phone,
        address: updatedProfile.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        profilePicture: updatedProfile.profilePicture
      });
      
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      console.error('Profile update error:', err);
      addToast('Failed to update profile: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    userService.logout();
    orderService.logout();
    addToast('You have been successfully logged out', 'success');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-header-gradient">
          <h1><span className="icon">👤</span> My Profile</h1>
          <p>Manage your personal information and view your history</p>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user || !token) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-header-gradient">
        <h1><span className="icon">👤</span> My Profile</h1>
        <p>Manage your personal information and view your history</p>
      </div>

      <div className="profile-layout">
        {/* Sidebar Navigation */}
        <div className="profile-sidebar">
          <nav className="profile-nav">
            <button 
              className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="nav-icon">📝</span>
              Personal Information
            </button>
            <button 
              className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <span className="nav-icon">📦</span>
              Order History
            </button>
            <button 
              className={`nav-link ${activeTab === 'reservations' ? 'active' : ''}`}
              onClick={() => setActiveTab('reservations')}
            >
              <span className="nav-icon">📅</span>
              Reservation History
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {activeTab === 'profile' && (
            <div className="profile-section">
              <h2>Personal Information</h2>
              <form className="profile-form" onSubmit={handleSubmit}>
                {/* Profile Picture Section */}
                <div className="profile-picture-section">
                  <div className="profile-picture-container">
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Profile" 
                        className="profile-picture-preview"
                      />
                    ) : (
                      <div className="profile-picture-placeholder">
                        <span className="placeholder-icon">👤</span>
                        <span className="placeholder-text">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="profile-picture-controls">
                    <label htmlFor="profilePicture" className="btn-upload-picture">
                      Choose Image
                    </label>
                    <input
                      type="file"
                      id="profilePicture"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      style={{ display: 'none' }}
                    />
                    {previewImage && (
                      <button
                        type="button"
                        className="btn-remove-picture"
                        onClick={() => {
                          setPreviewImage('');
                          setUserData(prev => ({
                            ...prev,
                            profilePicture: ''
                          }));
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address.street">Street Address</label>
                  <input
                    type="text"
                    id="address.street"
                    name="address.street"
                    value={userData.address.street}
                    onChange={handleInputChange}
                    placeholder="Enter your street address"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="address.city">City</label>
                    <input
                      type="text"
                      id="address.city"
                      name="address.city"
                      value={userData.address.city}
                      onChange={handleInputChange}
                      placeholder="City"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address.state">State</label>
                    <input
                      type="text"
                      id="address.state"
                      name="address.state"
                      value={userData.address.state}
                      onChange={handleInputChange}
                      placeholder="State"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="address.zipCode">ZIP Code</label>
                    <input
                      type="text"
                      id="address.zipCode"
                      name="address.zipCode"
                      value={userData.address.zipCode}
                      onChange={handleInputChange}
                      placeholder="ZIP Code"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address.country">Country</label>
                    <input
                      type="text"
                      id="address.country"
                      name="address.country"
                      value={userData.address.country}
                      onChange={handleInputChange}
                      placeholder="Country"
                    />
                  </div>
                </div>

                <div className="profile-actions">
                  <button 
                    type="submit" 
                    className="btn-update"
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Updating...' : 'Update Profile'}
                  </button>
                  <button type="button" className="btn-logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="profile-section">
              <h2>Order History</h2>
              <div className="history-list">
                {orders.length === 0 ? (
                  <div className="empty-message">
                    <p>No orders found.</p>
                    <p>Start ordering delicious meals today!</p>
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order._id} className="history-item">
                      <div className="history-item-header">
                        <span className="order-id">Order #{order._id.slice(-6)}</span>
                        <span className={`status ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="history-item-details">
                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p><strong>Items:</strong> {order.items.length}</p>
                        <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'reservations' && (
            <div className="profile-section">
              <h2>Reservation History</h2>
              <div className="history-list">
                {reservations.length === 0 ? (
                  <div className="empty-message">
                    <p>No reservations found.</p>
                    <p>Make a reservation to dine with us!</p>
                  </div>
                ) : (
                  reservations.map(reservation => (
                    <div key={reservation._id || reservation.id} className="history-item">
                      <div className="history-item-header">
                        <span className="order-id">Reservation #{reservation._id ? reservation._id.slice(-6) : reservation.id}</span>
                        <span className={`status ${reservation.status.toLowerCase()}`}>
                          {reservation.status}
                        </span>
                      </div>
                      <div className="history-item-details">
                        <p><strong>Date:</strong> {new Date(reservation.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {reservation.time}</p>
                        <p><strong>Guests:</strong> {reservation.guests}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;