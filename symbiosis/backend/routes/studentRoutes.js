const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getDashboardData, getAllStudents, createStudent, deleteStudent } = require('../controllers/studentController');

router.get('/dashboard', protect, authorize('STUDENT'), getDashboardData);

router
  .route('/')
  .get(protect, authorize('ADMIN', 'TEACHER'), getAllStudents)
  .post(protect, authorize('ADMIN'), createStudent);

router
  .route('/:id')
  .delete(protect, authorize('ADMIN'), deleteStudent);

module.exports = router;
