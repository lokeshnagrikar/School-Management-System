const mongoose = require('mongoose');

const transportSchema = mongoose.Schema({
    routeName: {
        type: String,
        required: true,
        unique: true
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    driverName: {
        type: String,
        required: true
    },
    driverPhone: {
        type: String
    },
    routeCharges: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    stops: [{
        stopName: String,
        pickupTime: String,
        dropTime: String
    }],
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Transport', transportSchema);
