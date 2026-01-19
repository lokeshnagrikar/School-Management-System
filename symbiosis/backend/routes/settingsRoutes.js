const express = require('express');
const router = express.Router();
const {
    getUserPreferences,
    updateUserPreferences,
    getSystemConfig,
    updateSystemConfig
} = require('../controllers/settingsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/preferences')
    .get(protect, getUserPreferences)
    .put(protect, updateUserPreferences);

router.route('/system')
    .get(protect, authorize('ADMIN'), getSystemConfig)
    .put(protect, authorize('ADMIN'), updateSystemConfig);

module.exports = router;
