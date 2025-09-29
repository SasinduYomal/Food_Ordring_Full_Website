const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
const connectDB = require('./config/db');

async function checkUserOrders() {
  try {
    console.log('Connecting to database...');
    // Use the same connection approach as other scripts
    await connectDB();
    
    // Find the Sasindu Yomal user
    const user = await User.findOne({ email: 'sasinduyomal2002@example.com' });
    if (user) {
      console.log('User found:', user.name, user._id);
      
      // Find orders associated with this user
      const userOrders = await Order.find({ user: user._id });
      console.log('Orders associated with user:', userOrders.length);
      userOrders.forEach(order => {
        console.log(`Order ID: ${order._id}, Total: $${order.totalAmount}`);
      });
    } else {
      console.log('User not found');
    }
    
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUserOrders();