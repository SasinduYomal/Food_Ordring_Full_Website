const mongoose = require('mongoose');
const Order = require('../models/Order');
const connectDB = require('../config/db');

const testOrderAssociation = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Create a test order without user
    const orderWithoutUser = new Order({
      items: [{
        menuItem: '68c00c176c23c8461985e9a3', // Assuming this is a valid menu item ID
        quantity: 2,
        price: 10.99
      }],
      totalAmount: 21.98,
      deliveryAddress: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'Test Country'
      },
      paymentMethod: 'credit-card'
    });
    
    await orderWithoutUser.save();
    console.log('Order without user created:', orderWithoutUser._id);
    
    // Create a test user (you'll need to replace this with an actual user ID)
    const userId = '68c00ce9e7e64903e9a10887'; // Admin user ID
    
    // Associate the order with the user
    const result = await Order.updateMany(
      { _id: orderWithoutUser._id, user: { $exists: false } },
      { $set: { user: userId } }
    );
    
    console.log('Order association result:', result);
    
    // Verify the order is now associated with the user
    const updatedOrder = await Order.findById(orderWithoutUser._id);
    console.log('Updated order:', updatedOrder);
    
    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.connection.close();
  }
};

testOrderAssociation();