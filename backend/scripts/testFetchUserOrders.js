const mongoose = require('mongoose');
const Order = require('../models/Order');
const connectDB = require('../config/db');

const testFetchUserOrders = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Use the same user ID that we've been testing with
    const userId = '68c00ce9e7e64903e9a10887';
    
    console.log('Fetching orders for user:', userId);
    
    // This is the exact query used in the getMyOrders controller function
    const orders = await Order.find({ user: userId });
    
    console.log('Found orders:', orders.length);
    console.log('Orders:', orders);
    
    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.connection.close();
  }
};

testFetchUserOrders();