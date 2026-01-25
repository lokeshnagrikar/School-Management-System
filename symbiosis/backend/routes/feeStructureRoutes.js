const express = require('express');
const router = express.Router();
const { getFeeStructures, createFeeStructure, generateInvoices, deleteFeeStructure } = require('../controllers/feeStructureController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getFeeStructures)
    .post(protect, authorize('ADMIN'), createFeeStructure);

router.route('/:id')
    .delete(protect, authorize('ADMIN'), deleteFeeStructure);

router.route('/:id/generate')
    .post(protect, authorize('ADMIN'), generateInvoices);

module.exports = router;
