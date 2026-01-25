const express = require('express');
const router = express.Router();
const {
    markAttendance,
    getClassAttendance,
    getStudentAttendance
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('TEACHER', 'ADMIN'), markAttendance);
router.get('/class/:classId', protect, authorize('TEACHER', 'ADMIN'), getClassAttendance);
router.get('/student/:studentId', protect, authorize('STUDENT', 'ADMIN', 'TEACHER'), getStudentAttendance);

module.exports = router;
