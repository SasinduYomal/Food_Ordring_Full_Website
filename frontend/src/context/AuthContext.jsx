import React, { createContext, useContext, useState, useEffect } from 'react';
import userService from '../services/userService';
import orderService from '../services/orderService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if there's a saved token in localStorage
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      try {
        // Validate token format
        if (savedToken && savedToken.startsWith('eyJ')) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          userService.setToken(savedToken);
          orderService.setToken(savedToken);
          console.log('Token loaded from localStorage');
        } else {
          console.log('Invalid token format, clearing storage');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await userService.login(credentials);
      const { token, ...userData } = response;
      
      // Validate token
      if (token && token.startsWith('eyJ')) {
        setToken(token);
        setUser(userData);
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Set token in API services
        userService.setToken(token);
        orderService.setToken(token);
        
        // Associate guest orders with the user
        try {
          // Get guest order IDs from localStorage
          const raw = localStorage.getItem('lastOrder');
          console.log('Raw lastOrder from localStorage:', raw);
          if (raw) {
            const lastOrder = JSON.parse(raw);
            console.log('Parsed lastOrder:', lastOrder);
            if (lastOrder && lastOrder._id) {
              console.log('Attempting to associate order with user:', lastOrder._id);
              // Associate the guest order with the user
              const result = await orderService.associateGuestOrders([lastOrder._id]);
              console.log('Order association result:', result);
              console.log('Guest order associated with user');
              // Clear the lastOrder from localStorage as it's now associated
              localStorage.removeItem('lastOrder');
            } else {
              console.log('lastOrder does not have _id property');
            }
          } else {
            console.log('No lastOrder found in localStorage');
          }
        } catch (error) {
          console.error('Error associating guest orders:', error);
          // Don't fail login if order association fails
        }
        
        return response;
      } else {
        throw new Error('Invalid token received from server');
      }
    } catch (error) {
      // Clear any invalid tokens
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      userService.removeToken();
      orderService.removeToken();
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    
    // Remove from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove token from API services
    userService.removeToken();
    orderService.removeToken();
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    token,
    login,
    logout,
    updateUser, // Added updateUser function to context
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};