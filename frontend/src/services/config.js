// Configuration file for the application
// This file demonstrates how to use environment variables

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const ASSET_BASE_URL = API_BASE_URL.replace(/\/?api\/?$/, '');

const config = {
  // API Configuration
  API_BASE_URL: API_BASE_URL,
  ASSET_BASE_URL: ASSET_BASE_URL,
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || import.meta.env.REACT_APP_API_TIMEOUT, 10) || 10000,
  
  // Application Settings
  APP_NAME: import.meta.env.VITE_APP_NAME || import.meta.env.REACT_APP_APP_NAME || 'Restaurant Ordering System',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || import.meta.env.REACT_APP_APP_VERSION || '1.0.0',
  
  // Authentication
  JWT_SECRET: import.meta.env.VITE_JWT_SECRET || import.meta.env.REACT_APP_JWT_SECRET || 'default-secret-key',
  TOKEN_EXPIRATION: import.meta.env.VITE_TOKEN_EXPIRATION || import.meta.env.REACT_APP_TOKEN_EXPIRATION || '24h',
  
  // Payment Integration
  STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY || import.meta.env.REACT_APP_STRIPE_PUBLIC_KEY || '',
  PAYPAL_CLIENT_ID: import.meta.env.VITE_PAYPAL_CLIENT_ID || import.meta.env.REACT_APP_PAYPAL_CLIENT_ID || '',
  
  // Feature Flags
  ENABLE_RESERVATIONS: (import.meta.env.VITE_ENABLE_RESERVATIONS || import.meta.env.REACT_APP_ENABLE_RESERVATIONS) === 'true',
  ENABLE_DELIVERY_TRACKING: (import.meta.env.VITE_ENABLE_DELIVERY_TRACKING || import.meta.env.REACT_APP_ENABLE_DELIVERY_TRACKING) === 'true',
  ENABLE_REVIEWS: (import.meta.env.VITE_ENABLE_REVIEWS || import.meta.env.REACT_APP_ENABLE_REVIEWS) === 'true',
  
  // Development Settings
  DEBUG_MODE: (import.meta.env.VITE_DEBUG_MODE || import.meta.env.REACT_APP_DEBUG_MODE) === 'true',
};

export default config;