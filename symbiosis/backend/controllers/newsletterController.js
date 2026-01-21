const asyncHandler = require('express-async-handler');
const Subscriber = require('../models/Subscriber');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
const subscribe = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const subscriberExists = await Subscriber.findOne({ email });

    if (subscriberExists) {
        res.status(400);
        throw new Error('Email already subscribed');
    }

    const subscriber = await Subscriber.create({
        email
    });

    if (subscriber) {
        res.status(201).json({
            _id: subscriber._id,
            email: subscriber.email,
            message: 'Subscribed successfully'
        });
    } else {
        res.status(400);
        throw new Error('Invalid subscriber data');
    }
});

// @desc    Get all subscribers
// @route   GET /api/newsletter
// @access  Private/Admin
const getSubscribers = asyncHandler(async (req, res) => {
    const subscribers = await Subscriber.find({});
    res.json(subscribers);
});

module.exports = {
    subscribe,
    getSubscribers
};
