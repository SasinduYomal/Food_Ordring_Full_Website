const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/db');

const createAdminUser = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists:');
      console.log('ID:', existingAdmin._id);
      console.log('Name:', existingAdmin.name);
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      mongoose.connection.close();
      return;
    }
    
    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    adminUser.password = await bcrypt.hash(adminUser.password, salt);
    
    // Save user
    await adminUser.save();
    
    console.log('Admin user created successfully:');
    console.log('ID:', adminUser._id);
    console.log('Name:', adminUser.name);
    console.log('Email:', adminUser.email);
    console.log('Role:', adminUser.role);
    console.log('Is Active:', adminUser.isActive);
    
    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.connection.close();
  }
};

createAdminUser();