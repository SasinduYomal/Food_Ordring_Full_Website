const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
const connectDB = require('./config/db');

async function checkDatabase() {
  try {
    console.log('Connecting to database...');
    // Use the same connection approach as other scripts
    await connectDB();
    console.log('Connected to database');
    
    // Count total orders
    const totalOrders = await Order.countDocuments();
    console.log('Total orders:', totalOrders);
    
    // Count orders with user field
    const ordersWithUser = await Order.countDocuments({ user: { $exists: true } });
    console.log('Orders with user field:', ordersWithUser);
    
    // Count orders without user field
    const ordersWithoutUser = await Order.countDocuments({ user: { $exists: false } });
    console.log('Orders without user field:', ordersWithoutUser);
    
    // Count orders with null user field
    const ordersWithNullUser = await Order.countDocuments({ user: null });
    console.log('Orders with null user field:', ordersWithNullUser);
    
    // Show sample orders
    console.log('\n--- Sample Orders ---');
    const sampleOrders = await Order.find().limit(5).populate('user', 'name email');
    sampleOrders.forEach(order => {
      console.log(`Order ID: ${order._id}`);
      console.log(`User: ${order.user ? `${order.user.name} (${order.user.email})` : 'None'}`);
      console.log(`Items: ${order.items.length}`);
      console.log(`Total: $${order.totalAmount}`);
      console.log('---');
    });
    
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error);
  }
}

checkDatabase();