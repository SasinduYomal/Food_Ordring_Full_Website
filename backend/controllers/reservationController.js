const Reservation = require('../models/Reservation');
const asyncHandler = require('express-async-handler');

// @desc    Create a new reservation
// @route   POST /api/reservations
// @access  Private
const createReservation = asyncHandler(async (req, res) => {
  const { date, time, guests, name, email, phone } = req.body;

  // Validate required fields
  if (!date || !time || !guests || !name || !email || !phone) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Create reservation
  const reservation = new Reservation({
    user: req.user._id,
    date,
    time,
    guests,
    name,
    email,
    phone,
    status: 'Pending'
  });

  const createdReservation = await reservation.save();
  res.status(201).json({
    success: true,
    message: 'Reservation submitted successfully! We will confirm your booking shortly.',
    reservation: createdReservation
  });
});

// @desc    Get logged in user's reservations
// @route   GET /api/reservations/my
// @access  Private
const getMyReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ user: req.user._id });
  res.json(reservations);
});

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private/Admin
const getAllReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({}).populate('user', 'name email');
  res.json(reservations);
});

// @desc    Get reservation by ID
// @route   GET /api/reservations/:id
// @access  Private/Admin
const getReservationById = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id).populate('user', 'name email');
  
  if (reservation) {
    res.json(reservation);
  } else {
    res.status(404);
    throw new Error('Reservation not found');
  }
});

// @desc    Update reservation status
// @route   PUT /api/reservations/:id/status
// @access  Private/Admin
const updateReservationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const reservation = await Reservation.findById(req.params.id);
  
  if (reservation) {
    reservation.status = status;
    const updatedReservation = await reservation.save();
    res.json(updatedReservation);
  } else {
    res.status(404);
    throw new Error('Reservation not found');
  }
});

// @desc    Delete reservation
// @route   DELETE /api/reservations/:id
// @access  Private/Admin
const deleteReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);
  
  if (reservation) {
    await reservation.remove();
    res.json({ message: 'Reservation removed' });
  } else {
    res.status(404);
    throw new Error('Reservation not found');
  }
});

module.exports = {
  createReservation,
  getMyReservations,
  getAllReservations,
  getReservationById,
  updateReservationStatus,
  deleteReservation
};