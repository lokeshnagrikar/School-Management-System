const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student management
 */

router
  .route('/')
  /**
   * @swagger
   * /api/students:
   *   get:
   *     summary: Get all students
   *     tags: [Students]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of students
   *   post:
   *     summary: Create a new student
   *     tags: [Students]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *               - password
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       201:
   *         description: Student created
   */
  .get(protect, getStudents)
  .post(protect, authorize('ADMIN', 'TEACHER'), createStudent);

router
  .route('/:id')
  /**
   * @swagger
   * /api/students/{id}:
   *   get:
   *     summary: Get student by ID
   *     tags: [Students]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Student details
   *   put:
   *     summary: Update student
   *     tags: [Students]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *     responses:
   *       200:
   *         description: Student updated
   *   delete:
   *     summary: Delete student
   *     tags: [Students]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Student deleted
   */
  .get(protect, getStudentById)
  .put(protect, authorize('ADMIN', 'TEACHER'), updateStudent)
  .delete(protect, authorize('ADMIN'), deleteStudent);

module.exports = router;
