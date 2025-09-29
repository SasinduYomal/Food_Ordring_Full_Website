const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const checkAdminUser = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Check if admin user exists
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    
    if (adminUser) {
      console.log('Admin user found:');
      console.log('ID:', adminUser._id);
      console.log('Name:', adminUser.name);
      console.log('Email:', adminUser.email);
      console.log('Role:', adminUser.role);
      console.log('Is Active:', adminUser.isActive);
    } else {
      console.log('No admin user found with email admin@example.com');
    }
    
    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.connection.close();
  }
};

checkAdminUser();