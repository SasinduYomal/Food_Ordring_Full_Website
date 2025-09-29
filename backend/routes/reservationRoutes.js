const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { protect, admin } = require('../middleware/auth');

// User routes
router.route('/')
  .post(protect, reservationController.createReservation);
  
router.route('/my')
  .get(protect, reservationController.getMyReservations);

// Admin routes
router.route('/')
  .get(protect, admin, reservationController.getAllReservations);

router.route('/:id')
  .get(protect, admin, reservationController.getReservationById)
  .delete(protect, admin, reservationController.deleteReservation);

router.route('/:id/status')
  .put(protect, admin, reservationController.updateReservationStatus);

module.exports = router;