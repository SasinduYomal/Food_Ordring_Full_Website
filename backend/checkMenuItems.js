const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/food_ordering', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const checkMenuItems = async () => {
  await connectDB();
  
  try {
    const menuItems = await MenuItem.find({});
    console.log(`Found ${menuItems.length} menu items:`);
    console.log(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
  } finally {
    mongoose.connection.close();
  }
};

checkMenuItems();