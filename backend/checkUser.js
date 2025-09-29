const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

async function checkUser() {
  try {
    console.log('Connecting to database...');
    // Use the same connection approach as other scripts
    await connectDB();
    
    // Check if the admin user exists
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    console.log('Admin user:', adminUser);
    
    // Check if there are any other users
    const allUsers = await User.find({});
    console.log('All users:', allUsers.length);
    allUsers.forEach(user => {
      console.log(`User: ${user.name} (${user.email}) - Active: ${user.isActive}`);
    });
    
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUser();