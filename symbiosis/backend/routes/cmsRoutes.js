const express = require('express');
const router = express.Router();
const {
  getNotices,
  createNotice,
  deleteNotice,
  getGallery,
  addGalleryItem,
  deleteGalleryItem,
  getDashboardStats,
} = require('../controllers/cmsController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: CMS
 *   description: Content Management (Notices, Gallery)
 */



router.get('/stats', protect, authorize('ADMIN'), getDashboardStats);

router
  .route('/notices')
  /**
   * @swagger
   * /api/cms/notices:
   *   get:
   *     summary: Get all notices
   *     tags: [CMS]
   *     responses:
   *       200:
   *         description: List of notices
   *   post:
   *     summary: Create a new notice
   *     tags: [CMS]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               content:
   *                 type: string
   *               date:
   *                 type: string
   *                 format: date
   *     responses:
   *       201:
   *         description: Notice created
   */
  .get(getNotices)
  .post(protect, authorize('ADMIN', 'TEACHER'), createNotice);

router
  .route('/notices/:id')
  /**
   * @swagger
   * /api/cms/notices/{id}:
   *   delete:
   *     summary: Delete a notice
   *     tags: [CMS]
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
   *         description: Notice deleted
   */
  .delete(protect, authorize('ADMIN', 'TEACHER'), deleteNotice);

router
  .route('/gallery')
  /**
   * @swagger
   * /api/cms/gallery:
   *   get:
   *     summary: Get all gallery items
   *     tags: [CMS]
   *     responses:
   *       200:
   *         description: List of gallery items
   *   post:
   *     summary: Add item to gallery
   *     tags: [CMS]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               imageUrl:
   *                 type: string
   *     responses:
   *       201:
   *         description: Item added
   */
  .get(getGallery)
  .post(protect, authorize('ADMIN'), addGalleryItem);

router
  .route('/gallery/:id')
  /**
   * @swagger
   * /api/cms/gallery/{id}:
   *   delete:
   *     summary: Delete a gallery item
   *     tags: [CMS]
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
   *         description: Item deleted
   */
  .delete(protect, authorize('ADMIN'), deleteGalleryItem);

module.exports = router;
