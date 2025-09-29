const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/foodordering', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the Order schema
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  items: [{
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
    },
    quantity: Number,
    price: Number
  }],
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

const Order = mongoose.model('Order', orderSchema);

// Check orders
async function checkOrders() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connection.once('open', async () => {
      console.log('Connected to MongoDB');
      
      // Find all orders
      const orders = await Order.find({}).populate('user', 'name email');
      console.log(`Found ${orders.length} orders:`);
      console.log(JSON.stringify(orders, null, 2));
      
      mongoose.connection.close();
    });
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

checkOrders();