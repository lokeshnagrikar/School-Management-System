const Notification = require('../models/Notification');
const User = require('../models/User');

const sendNotificationToUser = async (recipientId, message, type = 'info', link = null) => {
    try {
        await Notification.create({
            recipient: recipientId,
            message,
            type,
            link
        });
    } catch (error) {
        console.error("Error sending notification:", error);
    }
};

const sendNotificationToRole = async (role, message, type = 'info', link = null) => {
    try {
        const users = await User.find({ role }).select('_id');
        const notifications = users.map(user => ({
            recipient: user._id,
            message,
            type,
            link
        }));
        
        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }
    } catch (error) {
        console.error(`Error sending notification to role ${role}:`, error);
    }
};

// Simplified broadcast for now - can be refined to target specific classes
const sendNotificationToClass = async (className, message, type = 'info', link = null) => {
    // In a real app, this would query Students by class, then find their User IDs.
    // For now, let's just notify all students as a placeholder or implement specific logic if Student model has linked User.
    // Assuming Student model is separate from User model, we'd need to map.
    // FOR THIS DEMO: sending to all STUDENT role users.
    await sendNotificationToRole('STUDENT', message, type, link);
};

module.exports = {
    sendNotificationToUser,
    sendNotificationToRole,
    sendNotificationToClass
};
