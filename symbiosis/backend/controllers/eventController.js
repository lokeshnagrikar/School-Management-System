const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Public (or Protected)
const getEvents = asyncHandler(async (req, res) => {
    // Determine sort preference from query, default ascending date (upcoming first)
    // Actually for "All Events" view, maybe desc creation? 
    // Usually calendar view wants sorted by date.
    const events = await Event.find({}).sort({ date: 1 });
    res.json(events);
});

// @desc    Get upcoming events (limit 3-5)
// @route   GET /api/events/upcoming
// @access  Public
const getUpcomingEvents = asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await Event.find({
        date: { $gte: today } 
    })
    .sort({ date: 1 })
    .limit(3);

    res.json(events);
});

const { sendNotificationToRole } = require('../utils/notificationHelper');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = asyncHandler(async (req, res) => {
    const { title, date, description, category, location } = req.body;

    const event = await Event.create({
        title,
        date,
        description,
        category,
        location,
        organizer: req.user ? req.user._id : null
    });

    // Notify everyone
    const message = `New Event: ${title} on ${new Date(date).toLocaleDateString()}`;
    await sendNotificationToRole('STUDENT', message, 'info', '/events');
    await sendNotificationToRole('TEACHER', message, 'info', '/events');

    res.status(201).json(event);
});

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = asyncHandler(async (req, res) => {
    const { title, date, description, category, location } = req.body;
    const event = await Event.findById(req.params.id);

    if (event) {
        event.title = title || event.title;
        event.date = date || event.date;
        event.description = description || event.description;
        event.category = category || event.category;
        event.location = location || event.location;

        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (event) {
        await event.deleteOne();
        res.json({ message: 'Event removed' });
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
});

module.exports = {
    getEvents,
    getUpcomingEvents,
    createEvent,
    updateEvent,
    deleteEvent
};
