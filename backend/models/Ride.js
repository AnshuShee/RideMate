const mongoose = require('mongoose');

// Location sub-schema: stores name, latitude, longitude
const locationSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
}, { _id: false });

const rideSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // pickup and destination now support both:
    //  - old format (plain string) via the `name` field
    //  - new format with latitude + longitude
    pickup: {
        type: locationSchema,
        required: true
    },
    destination: {
        type: locationSchema,
        required: true
    },
    date: {
        type: String,
        required: true,
        trim: true
    },
    time: {
        type: String,
        required: true,
        trim: true
    },
    availableSeats: {
        type: Number,
        required: true,
        min: [1, 'Seats must be at least 1']
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    },
    vehicle: {
        type: String,
        trim: true,
        default: 'Standard'
    },
    status: {
        type: String,
        enum: ['upcoming', 'started', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    passengers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Ride', rideSchema);
