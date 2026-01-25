const asyncHandler = require('express-async-handler');
const Transport = require('../models/Transport');

// @desc    Get all routes
// @route   GET /api/transport
// @access  Private
const getRoutes = asyncHandler(async (req, res) => {
    const routes = await Transport.find({});
    res.json(routes);
});

// @desc    Create a new route
// @route   POST /api/transport
// @access  Private (Admin only)
const createRoute = asyncHandler(async (req, res) => {
    const route = await Transport.create(req.body);
    res.status(201).json(route);
});

// @desc    Update route details
// @route   PUT /api/transport/:id
// @access  Private (Admin only)
const updateRoute = asyncHandler(async (req, res) => {
    const route = await Transport.findById(req.params.id);

    if (route) {
        const updatedRoute = await Transport.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.json(updatedRoute);
    } else {
        res.status(404);
        throw new Error('Route not found');
    }
});

// @desc    Delete route
// @route   DELETE /api/transport/:id
// @access  Private (Admin only)
const deleteRoute = asyncHandler(async (req, res) => {
    const route = await Transport.findById(req.params.id);

    if (route) {
        await route.deleteOne();
        res.json({ message: 'Route removed' });
    } else {
        res.status(404);
        throw new Error('Route not found');
    }
});

module.exports = {
    getRoutes,
    createRoute,
    updateRoute,
    deleteRoute
};
