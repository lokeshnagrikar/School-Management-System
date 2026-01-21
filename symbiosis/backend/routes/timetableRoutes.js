const express = require('express');
const router = express.Router();
const { getClassTimetable, saveTimetable, getAllTimetables } = require('../controllers/timetableController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/class/:classId', protect, getClassTimetable);
router.post('/', protect, authorize('ADMIN'), saveTimetable);
router.get('/', protect, authorize('ADMIN'), getAllTimetables);

module.exports = router;
