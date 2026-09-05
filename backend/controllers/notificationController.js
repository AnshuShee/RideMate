const Notification = require('../models/Notification');

// Get all notifications for the logged-in user
const getNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (err) {
        console.error('Get Notifications Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get unread notification count
const getUnreadCount = async (req, res) => {
    try {
        const userId = req.userId;
        const count = await Notification.countDocuments({ user: userId, read: false });
        res.status(200).json({ unreadCount: count });
    } catch (err) {
        console.error('Get Unread Count Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Mark a single notification as read
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const notification = await Notification.findOne({ _id: id, user: userId });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.read = true;
        await notification.save();

        res.status(200).json({ message: 'Notification marked as read' });
    } catch (err) {
        console.error('Mark Read Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.userId;
        await Notification.updateMany({ user: userId, read: false }, { read: true });
        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (err) {
        console.error('Mark All Read Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a single notification
const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const deleted = await Notification.findOneAndDelete({ _id: id, user: userId });
        if (!deleted) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (err) {
        console.error('Delete Notification Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Internal Helper for Controllers
const createNotification = async (userId, title, message, type = 'ride') => {
    try {
        await Notification.create({
            user: userId,
            title,
            message,
            type
        });
    } catch (error) {
        console.error('Failed to create notification:', error);
    }
};

module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification
};
