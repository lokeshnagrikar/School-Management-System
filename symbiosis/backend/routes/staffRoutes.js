const express = require('express');
const router = express.Router();
const { getStaff, createStaff, deleteStaff, updateStaff } = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Staff
 *   description: Staff and Teacher management
 */

router
  .route('/')
  /**
   * @swagger
   * /api/staff:
   *   get:
   *     summary: Get all staff members
   *     tags: [Staff]
   *     responses:
   *       200:
   *         description: List of staff members
   *   post:
   *     summary: Create a new staff member
   *     tags: [Staff]
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
   *               position:
   *                 type: string
   *     responses:
   *       201:
   *         description: Staff member created
   */
  .get(getStaff)
  .post(protect, authorize('ADMIN'), createStaff);

router
  .route('/:id')
  /**
   * @swagger
   * /api/staff/{id}:
   *   put:
   *     summary: Update staff member
   *     tags: [Staff]
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
   *               email:
   *                 type: string
   *               position:
   *                 type: string
   *     responses:
   *       200:
   *         description: Staff member updated
   *   delete:
   *     summary: Delete a staff member
   *     tags: [Staff]
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
   *         description: Staff member deleted
   */
  .put(protect, authorize('ADMIN'), updateStaff)
  .delete(protect, authorize('ADMIN'), deleteStaff);

module.exports = router;
