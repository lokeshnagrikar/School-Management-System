const express = require('express');
const router = express.Router();
const { getRoutes, createRoute, updateRoute, deleteRoute } = require('../controllers/transportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getRoutes)
    .post(protect, authorize('ADMIN'), createRoute);

router.route('/:id')
    .put(protect, authorize('ADMIN'), updateRoute)
    .delete(protect, authorize('ADMIN'), deleteRoute);

module.exports = router;
