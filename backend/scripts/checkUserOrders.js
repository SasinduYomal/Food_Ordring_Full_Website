const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/User');
const connectDB = require('../config/db');

const checkUserOrders = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Get the user ID from the token (this is just for testing)
    // In a real scenario, you would get this from the authenticated request
    const userId = '68c00ce9e7e64903e9a10887'; // Admin user ID for testing
    
    // Find the user
    const user = await User.findById(userId);
    console.log('User:', user);
    
    // Find orders associated with this user
    const userOrders = await Order.find({ user: userId });
    console.log('Orders associated with user:', userOrders.length);
    console.log('User orders:', userOrders);
    
    // Find orders without user association
    const guestOrders = await Order.find({ user: { $exists: false } });
    console.log('Guest orders (without user):', guestOrders.length);
    console.log('Guest orders:', guestOrders);
    
    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.connection.close();
  }
};

checkUserOrders();