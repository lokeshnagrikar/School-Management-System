const express = require('express');
const router = express.Router();
const {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
} = require('../controllers/enquiryController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Enquiries
 *   description: Public enquiries
 */

router
  .route('/')
  /**
   * @swagger
   * /api/enquiries:
   *   post:
   *     summary: Submit a new enquiry
   *     tags: [Enquiries]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               message:
   *                 type: string
   *     responses:
   *       201:
   *         description: Enquiry submitted
   *   get:
   *     summary: Get all enquiries
   *     tags: [Enquiries]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of enquiries
   */
  .post(createEnquiry)
  .get(protect, authorize('ADMIN'), getEnquiries);

router.route('/:id')
  /**
   * @swagger
   * /api/enquiries/{id}:
   *   put:
   *     summary: Update enquiry status
   *     tags: [Enquiries]
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
   *               status:
   *                 type: string
   *                 enum: [Pending, Contacted, Resolved]
   *     responses:
   *       200:
   *         description: Status updated
   */
  .put(protect, authorize('ADMIN'), updateEnquiryStatus);

module.exports = router;
