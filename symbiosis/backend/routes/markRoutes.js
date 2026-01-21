const express = require('express');
const router = express.Router();
const { uploadMarks, getMarks } = require('../controllers/markController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('TEACHER', 'ADMIN'), uploadMarks);
router.get('/:classId/:subjectId/:examType', protect, authorize('TEACHER', 'ADMIN', 'STUDENT'), getMarks);

module.exports = router;
