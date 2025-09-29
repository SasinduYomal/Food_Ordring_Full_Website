import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import reviewService from '../../services/reviewService';
import './ManageUsers.css';

const ManageUsers = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (token) {
          console.log('Setting token for user service');
          userService.setToken(token);
          reviewService.setToken(token);
          console.log('Fetching users from backend');
          const userData = await userService.getAllUsers();
          console.log('Users fetched:', userData);
          setUsers(userData);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        
        // Handle authorization errors according to project specifications
        if (err.message.includes('Not authorized')) {
          // Clear tokens and redirect to login
          logout();
          navigate('/login');
          // Display user-friendly message
          alert('Your session has expired. Please log in again.');
        } else {
          setError('Failed to fetch users: ' + err.message);
        }
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        if (token) {
          reviewService.setToken(token);
          const reviewData = await reviewService.getAllReviews();
          setReviews(reviewData);
          setReviewsLoading(false);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        
        // Handle authorization errors
        if (err.message.includes('Not authorized')) {
          // Clear tokens and redirect to login
          logout();
          navigate('/login');
          // Display user-friendly message
          alert('Your session has expired. Please log in again.');
        } else {
          setError('Failed to fetch reviews: ' + err.message);
        }
        setReviewsLoading(false);
      }
    };

    fetchUsers();
    fetchReviews();
  }, [token, logout, navigate]);

  const toggleUserStatus = async (userId) => {
    try {
      // Find the current user to get their current status
      const user = users.find(u => u._id === userId);
      if (!user) return;

      console.log('Updating user status for user:', userId, 'to:', !user.isActive);
      
      // Update the user status in the backend
      const updatedUser = await userService.updateUserStatus(userId, !user.isActive);
      console.log('User status updated:', updatedUser);
      
      // Update the local state
      setUsers(prev => 
        prev.map(u => 
          u._id === userId 
            ? { ...u, isActive: updatedUser.isActive } 
            : u
        )
      );
    } catch (err) {
      console.error('Error updating user status:', err);
      
      // Handle authorization errors according to project specifications
      if (err.message.includes('Not authorized')) {
        // Clear tokens and redirect to login
        logout();
        navigate('/login');
        // Display user-friendly message
        alert('Your session has expired. Please log in again.');
      } else {
        setError('Failed to update user status: ' + err.message);
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      if (window.confirm('Are you sure you want to delete this review?')) {
        await reviewService.deleteReview(reviewId);
        // Remove the review from the local state
        setReviews(prev => prev.filter(review => review._id !== reviewId));
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Failed to delete review: ' + err.message);
    }
  };

  const getStatusClass = (isActive) => {
    return isActive ? 'active' : 'inactive';
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Active' : 'Inactive';
  };

  if (loading) {
    return <div className="manage-users">Loading users...</div>;
  }

  if (error) {
    return <div className="manage-users">Error: {error}</div>;
  }

  return (
    <div className="manage-users">
      <div className="users-header">
        <h1>Customer Management</h1>
      </div>

      <div className="users-list">
        <h2>Registered Customers</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || 'N/A'}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`status ${getStatusClass(user.isActive)}`}>
                      {getStatusText(user.isActive)}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="action-btn"
                      onClick={() => toggleUserStatus(user._id)}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="feedback-list">
        <h2>Customer Feedback</h2>
        {reviewsLoading ? (
          <p>Loading reviews...</p>
        ) : error ? (
          <p>Error loading reviews: {error}</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Menu Item</th>
                  <th>Feedback</th>
                  <th>Rating</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(review => (
                  <tr key={review._id}>
                    <td>{review.user?.name || 'Anonymous'}</td>
                    <td>{review.menuItem?.name || 'Unknown Item'}</td>
                    <td>{review.comment}</td>
                    <td>
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </td>
                    <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteReview(review._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {reviews.length === 0 && (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No customer feedback available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;