const Message = require('../models/Message');
const User = require('../models/User');
const Ride = require('../models/Ride');
const { createNotification } = require('./notificationController');

const sendMessage = async (req, res) => {
    try {
        const { rideId, receiverId, message } = req.body;
        const senderId = req.userId;

        if (!message || message.trim() === '') {
            return res.status(400).json({ message: 'Message cannot be empty' });
        }
        if (!rideId || !receiverId) {
            return res.status(400).json({ message: 'Ride ID and Receiver ID are required' });
        }

        const ride = await Ride.findById(rideId);
        if (!ride) return res.status(404).json({ message: 'Ride not found' });

        const isDriver = ride.driver.toString() === senderId;
        const isPassenger = ride.passengers.includes(senderId);

        if (!isDriver && !isPassenger) {
            return res.status(403).json({ message: 'Not authorized to access this chat' });
        }

        const isReceiverDriver = ride.driver.toString() === receiverId;
        const isReceiverPassenger = ride.passengers.includes(receiverId);

        if (!isReceiverDriver && !isReceiverPassenger) {
            return res.status(403).json({ message: 'Receiver is not part of this ride' });
        }

        const newMessage = new Message({
            ride: rideId,
            sender: senderId,
            receiver: receiverId,
            message: message.trim()
        });

        await newMessage.save();

        const populatedMessage = await Message.findById(newMessage._id)
            .populate('sender', 'name')
            .populate('receiver', 'name');

        // Notify Receiver
        await createNotification(
            receiverId,
            'New Message',
            `You have a new message from ${populatedMessage.sender.name}.`,
            'message'
        );

        res.status(201).json({
            message: 'Message sent successfully',
            data: populatedMessage
        });

    } catch (err) {
        console.error('Send Message Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getMessages = async (req, res) => {
    try {
        const { rideId, otherUserId } = req.params;
        const userId = req.userId;

        const ride = await Ride.findById(rideId);
        if (!ride) return res.status(404).json({ message: 'Ride not found' });

        const isDriver = ride.driver.toString() === userId;
        const isPassenger = ride.passengers.includes(userId);

        if (!isDriver && !isPassenger) {
            return res.status(403).json({ message: 'Not authorized to access this chat' });
        }

        // Two-way conversation between userId and otherUserId only (no mixing users)
        const messages = await Message.find({
            ride: rideId,
            $or: [
                { sender: userId, receiver: otherUserId },
                { sender: otherUserId, receiver: userId }
            ]
        })
            .populate('sender', 'name')
            .sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (err) {
        console.error('Get Messages Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { sendMessage, getMessages };
