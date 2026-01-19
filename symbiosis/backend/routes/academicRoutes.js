const express = require('express');
const router = express.Router();
const {
  getClasses,
  createClass,
  getSubjects,
  createSubject,
} = require('../controllers/academicController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Academic
 *   description: Class and Subject management
 */

/**
 * @swagger
 * /api/academic/classes:
 *   get:
 *     summary: Get all classes
 *     tags: [Academic]
 *     responses:
 *       200:
 *         description: List of classes
 *   post:
 *     summary: Create a class
 *     tags: [Academic]
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
 *             properties:
 *               name:
 *                 type: string
 *               sections:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Class created
 */
router
  .route('/classes')
  .get(getClasses)
  .post(protect, authorize('ADMIN', 'TEACHER'), createClass);

/**
 * @swagger
 * /api/academic/subjects:
 *   get:
 *     summary: Get all subjects
 *     tags: [Academic]
 *     responses:
 *       200:
 *         description: List of subjects
 *   post:
 *     summary: Create a subject
 *     tags: [Academic]
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
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subject created
 */
router
  .route('/subjects')
  .get(getSubjects)
  .post(protect, authorize('ADMIN', 'TEACHER'), createSubject);

module.exports = router;
