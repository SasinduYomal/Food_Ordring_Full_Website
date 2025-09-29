const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// Create new order
const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, paymentStatus, transactionId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Get item details and calculate total
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item not found: ${item.menuItem}` });
      }
      
      const price = menuItem.price;
      const quantity = item.quantity;
      const itemTotal = price * quantity;
      
      orderItems.push({
        menuItem: menuItem._id,
        quantity,
        price,
        // Include customizations if they exist
        customizations: item.customizations
      });
      
      totalAmount += itemTotal;
    }

    // Create order
    const orderData = {
      items: orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentStatus || 'pending'
    };

    // Add transaction ID if provided
    if (transactionId) {
      orderData.transactionId = transactionId;
    }

    // Only associate with user if user is logged in
    if (req.user) {
      console.log('Creating order for logged in user:', req.user._id);
      orderData.user = req.user._id;
    } else {
      console.log('Creating guest order (no user associated)');
    }

    const order = new Order(orderData);
    const createdOrder = await order.save();
    console.log('Order created:', createdOrder._id, 'User:', createdOrder.user);
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logged in user orders
const getMyOrders = async (req, res) => {
  try {
    console.log('getMyOrders called');
    console.log('User from request:', req.user);
    
    if (!req.user) {
      console.log('No user found in request');
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    console.log('Fetching orders for user ID:', req.user._id);
    const orders = await Order.find({ user: req.user._id });
    console.log('Found orders for user:', orders.length);
    console.log('Orders:', orders);
    res.json(orders);
  } catch (error) {
    console.error('Error in getMyOrders:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (admin only)
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order counts for menu items
const getOrderCountsForMenuItems = async (req, res) => {
  try {
    // Aggregate orders to count how many times each menu item has been ordered
    const orderCounts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.menuItem',
          orderCount: { $sum: '$items.quantity' }
        }
      }
    ]);
    
    // Convert to a map for easier lookup
    const orderCountMap = {};
    orderCounts.forEach(item => {
      orderCountMap[item._id] = item.orderCount;
    });
    
    res.json(orderCountMap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order to delivered (admin only)
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = 'delivered';
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Associate guest orders with user
const associateGuestOrders = async (req, res) => {
  try {
    console.log('associateGuestOrders called with:', req.body);
    console.log('User ID:', req.user._id);
    
    // Get guest order IDs from request body
    const { orderIds } = req.body;
    
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      console.log('No order IDs provided');
      return res.status(400).json({ message: 'No order IDs provided' });
    }
    
    console.log('Order IDs to associate:', orderIds);
    
    // Update orders to associate with the user
    // Modified to also update orders where user is null or undefined
    const result = await Order.updateMany(
      { 
        _id: { $in: orderIds }, 
        $or: [
          { user: { $exists: false } },
          { user: null },
          { user: { $exists: true, $eq: null } }
        ]
      },
      { $set: { user: req.user._id } }
    );
    
    console.log('Update result:', result);
    
    res.json({ message: `${result.modifiedCount} orders associated with your account` });
  } catch (error) {
    console.error('Error in associateGuestOrders:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  getOrderCountsForMenuItems,
  updateOrderToDelivered,
  associateGuestOrders,
};