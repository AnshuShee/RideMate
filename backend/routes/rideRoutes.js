const express = require('express');
const router = express.Router();
const { createRide, getAllRides, getRideById } = require('../controllers/rideController');
const authMiddleware = require('../middleware/authMiddleware');

// Ride routes
router.post('/', authMiddleware, createRide); // Protected
router.get('/', getAllRides);                 // Public
router.get('/:id', getRideById);             // Public

module.exports = router;
