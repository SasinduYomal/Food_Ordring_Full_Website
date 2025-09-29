const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/db');

const resetAdminPassword = async () => {
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
      
      // Reset password
      const newPassword = 'admin123';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // Update user with new password
      const updatedUser = await User.findByIdAndUpdate(
        adminUser._id,
        { password: hashedPassword },
        { new: true }
      );
      
      console.log('Password reset successfully');
      
      // Test password
      const isMatch = await bcrypt.compare(newPassword, updatedUser.password);
      console.log('Does password "' + newPassword + '" match?', isMatch);
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

resetAdminPassword();