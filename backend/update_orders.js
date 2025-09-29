const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/foodordering', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the User and Order schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  }
}, {
  timestamps: true
});

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
  },
  quantity: Number,
  price: Number
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  items: [orderItemSchema],
  totalAmount: Number,
  status: String,
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: String,
  paymentStatus: String
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);

// Update orders to associate with a user
async function updateOrders() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connection.once('open', async () => {
      console.log('Connected to MongoDB');
      
      // Find a user to associate with orders (first user in the database)
      const user = await User.findOne({});
      if (!user) {
        console.log('No users found in the database');
        mongoose.connection.close();
        return;
      }
      
      console.log(`Found user: ${user.name} (${user.email})`);
      
      // Find all orders without a user
      const orders = await Order.find({ user: { $exists: false } });
      console.log(`Found ${orders.length} orders without user association`);
      
      // Update each order to associate with the user
      for (const order of orders) {
        order.user = user._id;
        await order.save();
        console.log(`Updated order ${order._id} to associate with user ${user.name}`);
      }
      
      console.log('All orders updated successfully');
      mongoose.connection.close();
    });
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

updateOrders();