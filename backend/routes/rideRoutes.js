const express = require('express');
const router = express.Router();
const { createRide, getAllRides, getRideById, getMyRides, joinRide, cancelRide, deleteRide, startRide, completeRide } = require('../controllers/rideController');
const authMiddleware = require('../middleware/authMiddleware');

// Ride routes
router.post('/', authMiddleware, createRide); // Protected
router.get('/', getAllRides);                 // Public
router.get('/my-rides', authMiddleware, getMyRides); // Protected (must be before /:id)
router.get('/:id', getRideById);             // Public
router.delete('/:id', authMiddleware, deleteRide); // Protected

// Action routes
router.post('/:id/join', authMiddleware, joinRide);     // Protected
router.post('/:id/cancel', authMiddleware, cancelRide); // Protected
router.put('/:id/start', authMiddleware, startRide);    // Protected
router.put('/:id/complete', authMiddleware, completeRide); // Protected

module.exports = router;
