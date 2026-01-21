const express = require('express');
const router = express.Router();
const { subscribe, getSubscribers } = require('../controllers/newsletterController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', subscribe);
router.get('/', protect, authorize('ADMIN'), getSubscribers);

module.exports = router;
