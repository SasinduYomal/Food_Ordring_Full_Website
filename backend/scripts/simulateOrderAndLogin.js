const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/User');
const connectDB = require('../config/db');

const simulateOrderAndLogin = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Create a test order without user (simulating a guest order)
    const guestOrder = new Order({
      items: [{
        menuItem: '68c00c176c23c8461985e9a3', // Assuming this is a valid menu item ID
        quantity: 2,
        price: 15.99
      }],
      totalAmount: 31.98,
      deliveryAddress: {
        street: '456 Guest St',
        city: 'Guest City',
        state: 'GS',
        zipCode: '67890',
        country: 'Guest Country'
      },
      paymentMethod: 'credit-card'
    });
    
    await guestOrder.save();
    console.log('Guest order created:', guestOrder._id);
    
    // Simulate storing this order in localStorage (as lastOrder)
    const lastOrderData = {
      _id: guestOrder._id.toString(),
      createdAt: guestOrder.createdAt,
      status: guestOrder.status,
      totalAmount: guestOrder.totalAmount,
      items: guestOrder.items.map(item => ({
        name: 'Test Item',
        quantity: item.quantity,
        price: item.price
      }))
    };
    
    console.log('Simulated lastOrder data that would be stored in localStorage:');
    console.log(JSON.stringify(lastOrderData, null, 2));
    
    // Simulate user login and order association
    const userId = '68c00ce9e7e64903e9a10887'; // Admin user ID
    
    // Associate the guest order with the user
    console.log('Associating guest order with user...');
    const result = await Order.updateMany(
      { _id: guestOrder._id, user: { $exists: false } },
      { $set: { user: userId } }
    );
    
    console.log('Association result:', result);
    
    // Verify the order is now associated with the user
    const updatedOrder = await Order.findById(guestOrder._id);
    console.log('Updated order after association:', updatedOrder);
    
    // Check user's orders
    const userOrders = await Order.find({ user: userId });
    console.log('Total orders for user after association:', userOrders.length);
    
    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.connection.close();
  }
};

simulateOrderAndLogin();