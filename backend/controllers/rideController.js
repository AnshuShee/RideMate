const Ride = require('../models/Ride');

// Create a new ride
const createRide = async (req, res) => {
    try {
        const { pickup, destination, date, time, availableSeats, price, vehicle } = req.body;

        // 1. Basic Validation
        if (!pickup || !destination || !date || !time || availableSeats === undefined || price === undefined || !vehicle) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const seatsNum = Number(availableSeats);
        const priceNum = Number(price);

        if (isNaN(seatsNum) || seatsNum <= 0) {
            return res.status(400).json({ message: 'Available seats must be greater than 0' });
        }

        if (isNaN(priceNum) || priceNum < 0) {
            return res.status(400).json({ message: 'Price cannot be negative' });
        }

        // 2. Create and Save Ride
        const newRide = new Ride({
            driver: req.userId, // set from JWT in authMiddleware
            pickup: pickup.trim(),
            destination: destination.trim(),
            date: date.trim(),
            time: time.trim(),
            availableSeats: seatsNum,
            price: priceNum,
            vehicle: vehicle.trim(),
            status: 'upcoming'
        });

        await newRide.save();

        res.status(201).json({
            message: 'Ride created successfully',
            ride: newRide
        });
    } catch (err) {
        console.error('CreateRide Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get all rides (with optional search filters)
const getAllRides = async (req, res) => {
    try {
        const { pickup, destination, date } = req.query;

        // Only query upcoming rides with available seats
        const query = {
            status: 'upcoming',
            availableSeats: { $gt: 0 }
        };

        // Simple filtering matches (case-insensitive substring for locations)
        if (pickup && pickup.trim() !== '') {
            query.pickup = { $regex: pickup.trim(), $options: 'i' };
        }
        if (destination && destination.trim() !== '') {
            query.destination = { $regex: destination.trim(), $options: 'i' };
        }
        if (date && date.trim() !== '') {
            query.date = { $regex: date.trim(), $options: 'i' };
        }

        const rides = await Ride.find(query)
            .populate('driver', 'name email')
            .sort({ date: 1, time: 1 });

        res.status(200).json(rides);
    } catch (err) {
        console.error('GetAllRides Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get ride by ID details
const getRideById = async (req, res) => {
    try {
        const { id } = req.params;

        const ride = await Ride.findById(id).populate('driver', 'name email');
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        res.status(200).json(ride);
    } catch (err) {
        console.error('GetRideById Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
    createRide,
    getAllRides,
    getRideById
};
