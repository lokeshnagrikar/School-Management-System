const express = require('express');
const router = express.Router();
const { getTeacherDashboardStats, getTeacherSchedule } = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('TEACHER', 'ADMIN'), getTeacherDashboardStats);
router.get('/schedule', protect, authorize('TEACHER', 'ADMIN'), getTeacherSchedule);

module.exports = router;
