const mongoose = require('mongoose');

const activitySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    action: {
        type: String, // 'LOGIN', 'PROFILE_UPDATE', 'UPLOAD'
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    ipAddress: {
        type: String,
    },
    userAgent: {
        type: String,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Activity', activitySchema);
