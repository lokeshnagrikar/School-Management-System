const asyncHandler = require('express-async-handler');
const Fee = require('../models/Fee');
const Student = require('../models/Student');
const generateInvoice = require('../utils/generateInvoice');

// @desc    Get all fees (Admin) or My Fees (Student)
// @route   GET /api/fees
// @access  Private
const getFees = asyncHandler(async (req, res) => {
    if (req.user.role === 'student') {
        // Find student profile linked to user
        const student = await Student.findOne({ user: req.user._id });
        if (!student) {
            res.status(404);
            throw new Error('Student profile not found');
        }
        const fees = await Fee.find({ student: student._id }).populate('student', 'name admissionNumber');
        res.json(fees);
    } else {
        const fees = await Fee.find({}).populate('student', 'name admissionNumber');
        res.json(fees);
    }
});

// @desc    Create a new fee invoice
// @route   POST /api/fees
// @access  Private (Admin only)
const createFee = asyncHandler(async (req, res) => {
    const { studentId, amount, type, dueDate, academicYear } = req.body;

    const fee = await Fee.create({
        student: studentId,
        amount,
        type,
        dueDate,
        academicYear
    });

    res.status(201).json(fee);
});

// @desc    Update fee status (Mark as Paid)
// @route   PUT /api/fees/:id/pay
// @access  Private (Admin only)
const payFee = asyncHandler(async (req, res) => {
    const fee = await Fee.findById(req.params.id);

    if (fee) {
        fee.status = 'Paid';
        fee.paymentDate = Date.now();
        fee.transactionId = req.body.transactionId || `TXN${Date.now()}`;
        
        const updatedFee = await fee.save();
        res.json(updatedFee);
    } else {
        res.status(404);
        throw new Error('Fee record not found');
    }
});

// @desc    Download Fee Invoice
// @route   GET /api/fees/:id/invoice
// @access  Private
const downloadInvoice = asyncHandler(async (req, res) => {
    const fee = await Fee.findById(req.params.id).populate('student');

    if (fee) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${fee._id}.pdf`);
        
        generateInvoice(fee, res);
    } else {
        res.status(404);
        throw new Error('Fee record not found');
    }
});

module.exports = {
    getFees,
    createFee,
    payFee,
    downloadInvoice
};
