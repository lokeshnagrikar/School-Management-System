const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getDashboardData, getAllStudents, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');

router.get('/dashboard', protect, authorize('STUDENT'), getDashboardData);

router
  .route('/')
  .get(protect, authorize('ADMIN', 'TEACHER'), getAllStudents)
  .post(protect, authorize('ADMIN'), createStudent);

router
  .route('/:id')
  .put(protect, authorize('ADMIN'), updateStudent)
  .delete(protect, authorize('ADMIN'), deleteStudent);

module.exports = router;
