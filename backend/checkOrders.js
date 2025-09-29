require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');

async function checkOrders() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database');
    
    // Find all orders and populate user info
    const orders = await Order.find({}).populate('user', 'name email');
    console.log('Total orders found:', orders.length);
    
    orders.forEach(order => {
      console.log(`Order ID: ${order._id}`);
      console.log(`User: ${order.user ? order.user.name + ' (' + order.user.email + ')' : 'Guest (no user)'}`);
      console.log(`Items: ${order.items.length}`);
      console.log(`Total: $${order.totalAmount}`);
      console.log('---');
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkOrders();