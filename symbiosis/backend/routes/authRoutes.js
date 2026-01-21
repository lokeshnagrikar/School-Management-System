const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  uploadUserProfileImage,
  getRecentActivity,
  changeUserPassword,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */

router.get('/debug-config', (req, res) => {
  res.json({
    backendUrl: process.env.BACKEND_URL,
    frontendUrl: process.env.FRONTEND_URL,
    callbackUrl: `${process.env.BACKEND_URL}/api/users/google/callback`,
    googleClientId: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not Set'
  });
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Authenticate user & get token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authUser);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
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
 *               role:
 *                 type: string
 *                 enum: [ADMIN, TEACHER, STUDENT, PARENT]
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: User already exists
 */
router.route('/').post(registerUser);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 */
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

const upload = require('../middleware/uploadMiddleware');
const multer = require('multer');

router.post('/profile/image', protect, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: `Upload error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, uploadUserProfileImage);

router.get('/activity', protect, getRecentActivity);
router.put('/password', protect, changeUserPassword);

const passport = require('passport');
const generateToken = require('../utils/generateToken');

// @desc    Auth with Google
// @route   GET /api/users/google
// @access  Public
/**
 * @swagger
 * /api/users/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Google Login
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false, prompt: 'select_account' }));

// @desc    Google auth callback
// @route   GET /api/users/google/callback
// @access  Public
/**
 * @swagger
 * /api/users/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Frontend with token
 *       401:
 *         description: Authentication failed
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login?error=true`, session: false }),
  (req, res) => {
    // Successful authentication, redirect home.
    const token = generateToken(req.user._id);
    res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
    res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
  }
);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
