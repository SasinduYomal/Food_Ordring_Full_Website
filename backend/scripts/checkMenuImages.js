const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const connectDB = require('../config/db');

// Load env vars
require('dotenv').config();

const checkMenuImages = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Get all menu items
    const menuItems = await MenuItem.find({});
    
    console.log('Menu Items with Image URLs:');
    console.log('============================');
    
    menuItems.forEach(item => {
      console.log(`ID: ${item._id}`);
      console.log(`Name: ${item.name}`);
      console.log(`Image URL: ${item.imageUrl || 'No image URL'}`);
      console.log('---');
    });
    
    console.log(`Total menu items: ${menuItems.length}`);
    
    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
};

checkMenuImages();