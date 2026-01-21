const express = require('express');
const router = express.Router();
const { markAttendance, getAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('TEACHER', 'ADMIN'), markAttendance);
router.get('/:classId/:date', protect, authorize('TEACHER', 'ADMIN'), getAttendance);

module.exports = router;
