import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import contactService from '../../services/contactService';
import './ContactMessages.css';

const ContactMessages = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (token) {
          contactService.setToken(token);
          const messageData = await contactService.getAllMessages();
          setMessages(messageData);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
        
        // Handle authorization errors
        if (err.message.includes('Not authorized')) {
          // Clear tokens and redirect to login
          logout();
          navigate('/login');
          // Display user-friendly message
          alert('Your session has expired. Please log in again.');
        } else {
          setError('Failed to fetch messages: ' + err.message);
        }
        setLoading(false);
      }
    };

    fetchMessages();
  }, [token, logout, navigate]);

  const handleDeleteMessage = async (messageId) => {
    try {
      if (window.confirm('Are you sure you want to delete this message?')) {
        await contactService.deleteMessage(messageId);
        // Remove the message from the local state
        setMessages(prev => prev.filter(message => message._id !== messageId));
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      setError('Failed to delete message: ' + err.message);
    }
  };

  const handleStatusChange = async (messageId, newStatus) => {
    try {
      await contactService.updateMessageStatus(messageId, newStatus);
      // Update the message status in the local state
      setMessages(prev => 
        prev.map(message => 
          message._id === messageId 
            ? { ...message, status: newStatus } 
            : message
        )
      );
    } catch (err) {
      console.error('Error updating message status:', err);
      setError('Failed to update message status: ' + err.message);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'new': return 'status-new';
      case 'read': return 'status-read';
      case 'replied': return 'status-replied';
      case 'archived': return 'status-archived';
      default: return 'status-new';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'new': return 'New';
      case 'read': return 'Read';
      case 'replied': return 'Replied';
      case 'archived': return 'Archived';
      default: return 'New';
    }
  };

  if (loading) {
    return <div className="contact-messages">Loading messages...</div>;
  }

  if (error) {
    return <div className="contact-messages">Error: {error}</div>;
  }

  return (
    <div className="contact-messages">
      <div className="messages-header">
        <h1>Contact Messages</h1>
      </div>

      <div className="messages-list">
        <h2>All Messages</h2>
        {messages.length === 0 ? (
          <p className="no-messages">No contact messages available</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map(message => (
                  <tr key={message._id}>
                    <td>{message.name}</td>
                    <td>{message.email}</td>
                    <td>{message.subject}</td>
                    <td className="message-preview">{message.message}</td>
                    <td>{new Date(message.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status ${getStatusClass(message.status)}`}>
                        {getStatusText(message.status)}
                      </span>
                    </td>
                    <td>
                      <select 
                        value={message.status} 
                        onChange={(e) => handleStatusChange(message._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                      </select>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteMessage(message._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactMessages;