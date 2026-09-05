const Ride = require('../models/Ride');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// Helper: normalise a location value from the request body.
// Accepts either:
//   - an object  { name, latitude, longitude }
//   - a plain string  "College Campus"
// Always returns a locationSchema-compatible object.
const normaliseLocation = (value) => {
    if (typeof value === 'string') {
        return { name: value.trim(), latitude: null, longitude: null };
    }
    if (value && typeof value === 'object') {
        return {
            name: (value.name || '').trim(),
            latitude: value.latitude ?? null,
            longitude: value.longitude ?? null,
        };
    }
    return { name: '', latitude: null, longitude: null };
};

// Helper: return a display string for a location (for search filter)
const locationName = (loc) => {
    if (!loc) return '';
    if (typeof loc === 'string') return loc;
    return loc.name || '';
};

// ─── Create a new ride ────────────────────────────────────────────────────────
const createRide = async (req, res) => {
    try {
        const { pickup, destination, date, time, availableSeats, price, vehicle } = req.body;

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

        const newRide = new Ride({
            driver: req.userId,
            pickup: normaliseLocation(pickup),
            destination: normaliseLocation(destination),
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

// ─── Get all rides (with optional search filters) ─────────────────────────────
const getAllRides = async (req, res) => {
    try {
        const { pickup, destination, date } = req.query;

        const query = {
            status: 'upcoming',
            availableSeats: { $gt: 0 }
        };

        // Search by pickup.name (case-insensitive substring)
        if (pickup && pickup.trim() !== '') {
            query['pickup.name'] = { $regex: pickup.trim(), $options: 'i' };
        }
        if (destination && destination.trim() !== '') {
            query['destination.name'] = { $regex: destination.trim(), $options: 'i' };
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

// ─── Get ride by ID ───────────────────────────────────────────────────────────
const getRideById = async (req, res) => {
    try {
        const { id } = req.params;
        const ride = await Ride.findById(id)
            .populate('driver', 'name email')
            .populate('passengers', 'name email');
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }
        res.status(200).json(ride);
    } catch (err) {
        console.error('GetRideById Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ─── Join a ride ──────────────────────────────────────────────────────────────
const joinRide = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const ride = await Ride.findById(id);
        if (!ride) return res.status(404).json({ message: 'Ride not found' });
        if (ride.driver.toString() === userId) return res.status(400).json({ message: 'Driver cannot join their own ride' });
        if (ride.passengers.includes(userId)) return res.status(400).json({ message: 'You already joined this ride' });
        if (ride.availableSeats <= 0) return res.status(400).json({ message: 'No seats available' });

        ride.passengers.push(userId);
        ride.availableSeats -= 1;
        await ride.save();

        // Notify Driver
        const passenger = await User.findById(userId);
        await createNotification(
            ride.driver,
            'Ride Joined',
            `${passenger?.name || 'A user'} joined your ride to ${locationName(ride.destination)}.`,
            'ride'
        );

        res.status(200).json({ message: 'Ride joined successfully' });
    } catch (err) {
        console.error('JoinRide Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ─── Cancel a joined ride ─────────────────────────────────────────────────────
const cancelRide = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const ride = await Ride.findById(id);
        if (!ride) return res.status(404).json({ message: 'Ride not found' });
        if (!ride.passengers.includes(userId)) return res.status(400).json({ message: 'You have not joined this ride' });

        ride.passengers = ride.passengers.filter(p => p.toString() !== userId.toString());
        ride.availableSeats += 1;
        await ride.save();

        // Notify Driver
        const passenger = await User.findById(userId);
        await createNotification(
            ride.driver,
            'Ride Cancelled',
            `${passenger?.name || 'A user'} cancelled their booking for your ride to ${locationName(ride.destination)}.`,
            'ride'
        );

        res.status(200).json({ message: 'Ride cancelled successfully' });
    } catch (err) {
        console.error('CancelRide Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ─── Get My Rides ─────────────────────────────────────────────────────────────
const getMyRides = async (req, res) => {
    try {
        const userId = req.userId;
        const rides = await Ride.find({
            $or: [{ driver: userId }, { passengers: userId }]
        }).populate('driver', 'name email').sort({ date: 1, time: 1 });

        res.status(200).json(rides);
    } catch (err) {
        console.error('GetMyRides Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ─── Delete a Ride (Driver only) ──────────────────────────────────────────────
const deleteRide = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const ride = await Ride.findById(id);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        // Check if the user is the driver
        if (ride.driver.toString() !== userId) {
            return res.status(403).json({ message: 'Only the driver can delete this ride' });
        }

        await Ride.findByIdAndDelete(id);

        // Notify all passengers
        for (const passengerId of ride.passengers) {
            await createNotification(
                passengerId,
                'Ride Cancelled',
                `Your upcoming ride to ${locationName(ride.destination)} was cancelled by the driver.`,
                'alert'
            );
        }

        res.status(200).json({ message: 'Ride deleted successfully' });
    } catch (err) {
        console.error('DeleteRide Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ─── Start a Ride (Driver only) ───────────────────────────────────────────────
const startRide = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const ride = await Ride.findById(id);
        if (!ride) return res.status(404).json({ message: 'Ride not found' });

        if (ride.driver.toString() !== userId) {
            return res.status(403).json({ message: 'You are not the driver of this ride' });
        }

        if (ride.status === 'started') return res.status(400).json({ message: 'Ride has already started' });
        if (ride.status === 'completed') return res.status(400).json({ message: 'Ride is already completed' });
        if (ride.status === 'cancelled') return res.status(400).json({ message: 'Cancelled ride cannot be started' });

        ride.status = 'started';
        await ride.save();

        // Notify all passengers
        for (const passengerId of ride.passengers) {
            await createNotification(
                passengerId,
                'Ride Started',
                `Your ride from ${locationName(ride.pickup)} to ${locationName(ride.destination)} has started.`,
                'ride'
            );
        }

        res.status(200).json({ message: 'Ride started successfully', ride });
    } catch (err) {
        console.error('StartRide Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ─── Complete a Ride (Driver only) ────────────────────────────────────────────
const completeRide = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const ride = await Ride.findById(id);
        if (!ride) return res.status(404).json({ message: 'Ride not found' });

        if (ride.driver.toString() !== userId) {
            return res.status(403).json({ message: 'You are not the driver of this ride' });
        }

        if (ride.status === 'completed') return res.status(400).json({ message: 'Ride is already completed' });
        if (ride.status === 'upcoming') return res.status(400).json({ message: 'Ride must be started before it can be completed' });
        if (ride.status === 'cancelled') return res.status(400).json({ message: 'Cancelled ride cannot be completed' });

        ride.status = 'completed';
        await ride.save();

        // Notify all passengers
        for (const passengerId of ride.passengers) {
            await createNotification(
                passengerId,
                'Ride Completed',
                `Your ride from ${locationName(ride.pickup)} to ${locationName(ride.destination)} has been completed.`,
                'ride'
            );
        }

        res.status(200).json({ message: 'Ride completed successfully', ride });
    } catch (err) {
        console.error('CompleteRide Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
    createRide,
    getAllRides,
    getRideById,
    joinRide,
    cancelRide,
    getMyRides,
    deleteRide,
    startRide,
    completeRide
};
