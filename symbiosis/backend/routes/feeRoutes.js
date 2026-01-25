const express = require('express');
const router = express.Router();
const { getFees, createFee, payFee, downloadInvoice } = require('../controllers/feeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getFees)
    .post(protect, authorize('ADMIN'), createFee);

router.route('/:id/pay')
    .put(protect, authorize('ADMIN'), payFee);

router.route('/:id/invoice')
    .get(protect, downloadInvoice);

module.exports = router;
