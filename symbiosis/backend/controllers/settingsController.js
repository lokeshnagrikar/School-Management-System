const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const SystemConfig = require('../models/SystemConfig');

// @desc    Get user preferences
// @route   GET /api/settings/preferences
// @access  Private
const getUserPreferences = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json(user.preferences || {});
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user preferences
// @route   PUT /api/settings/preferences
// @access  Private
const updateUserPreferences = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.preferences = {
            ...user.preferences,
            ...req.body,
        };
        await user.save();
        res.json(user.preferences);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get system configuration
// @route   GET /api/settings/system
// @access  Private (Admin only or Public?) -> Let's make it Admin for full details, Public for basic if needed
const getSystemConfig = asyncHandler(async (req, res) => {
    // Check if config exists, if not create default
    let config = await SystemConfig.findOne();
    if (!config) {
        config = await SystemConfig.create({});
    }
    res.json(config);
});

// @desc    Update system configuration
// @route   PUT /api/settings/system
// @access  Private/Admin
const updateSystemConfig = asyncHandler(async (req, res) => {
    let config = await SystemConfig.findOne();
    if (!config) {
        config = await SystemConfig.create({});
    }

    config.schoolName = req.body.schoolName || config.schoolName;
    config.address = req.body.address || config.address;
    config.contactEmail = req.body.contactEmail || config.contactEmail;
    config.contactPhone = req.body.contactPhone || config.contactPhone;
    config.currentAcademicYear = req.body.currentAcademicYear || config.currentAcademicYear;
    config.maintenanceMode = req.body.maintenanceMode !== undefined ? req.body.maintenanceMode : config.maintenanceMode;

    const updatedConfig = await config.save();
    res.json(updatedConfig);
});

module.exports = {
    getUserPreferences,
    updateUserPreferences,
    getSystemConfig,
    updateSystemConfig
};
