const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  associateGuestOrders,
  getOrderCountsForMenuItems,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// Create order (public), list orders (admin)
router.route('/')
  .post(createOrder)
  .get(protect, admin, getOrders);

router.route('/myorders').get(protect, getMyOrders);
router.route('/associate-guest-orders').post(protect, associateGuestOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/counts/menu-items').get(getOrderCountsForMenuItems);

module.exports = router;