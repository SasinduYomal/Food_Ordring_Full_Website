import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    // Validate token format
    if (token && token.startsWith('eyJ') && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      setToken(token);
      // Set token in API service
      api.setToken(token);
    } else if (token || userData) {
      // Clear invalid tokens
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
  }, []);

  const login = (userData, token) => {
    // Validate token format
    if (token && token.startsWith('eyJ')) {
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
      setToken(token);
      // Set token in API service
      api.setToken(token);
    } else {
      throw new Error('Invalid token format');
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    
    // Update state
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    
    // Remove token from API service
    api.removeToken();
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};