const mongoose = require('mongoose');
const Order = require('../models/Order');
const connectDB = require('../config/db');

const debugOrderAssociation = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Get all orders and their user associations
    const allOrders = await Order.find({}).select('_id user status createdAt totalAmount');
    console.log('All orders in database:');
    allOrders.forEach(order => {
      console.log(`  Order ID: ${order._id}`);
      console.log(`    User: ${order.user || 'None (guest order)'}`);
      console.log(`    Status: ${order.status}`);
      console.log(`    Created: ${order.createdAt}`);
      console.log(`    Amount: $${order.totalAmount}`);
      console.log('  ---');
    });
    
    // Count guest orders vs user orders
    const guestOrders = await Order.find({ user: { $exists: false } }).countDocuments();
    const userOrders = await Order.find({ user: { $exists: true } }).countDocuments();
    
    console.log(`\nSummary:`);
    console.log(`  Guest orders (no user): ${guestOrders}`);
    console.log(`  User orders (with user): ${userOrders}`);
    console.log(`  Total orders: ${guestOrders + userOrders}`);
    
    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.connection.close();
  }
};

debugOrderAssociation();