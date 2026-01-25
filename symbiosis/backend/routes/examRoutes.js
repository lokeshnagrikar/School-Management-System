const express = require('express');
const router = express.Router();
const {
    createExam,
    getExams,
    enterMarks,
    getStudentResults,
    getClassResults
} = require('../controllers/examController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Exam Management
router.post('/', protect, authorize('ADMIN'), createExam);
router.get('/', protect, getExams);

// Marks Entry
router.post('/marks', protect, authorize('TEACHER', 'ADMIN'), enterMarks);

// Results View
router.get('/results/student/:studentId', protect, authorize('STUDENT', 'ADMIN', 'TEACHER'), getStudentResults);
router.get('/results/class/:classId/:examId', protect, authorize('TEACHER', 'ADMIN'), getClassResults);

module.exports = router;
