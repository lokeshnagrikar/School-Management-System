const asyncHandler = require('express-async-handler');
const FeeStructure = require('../models/FeeStructure');
const Fee = require('../models/Fee');
const Student = require('../models/Student');

// @desc    Get all fee structures
// @route   GET /api/fee-structures
// @access  Private (Admin)
const getFeeStructures = asyncHandler(async (req, res) => {
    const structures = await FeeStructure.find({}).populate('class', 'name');
    res.json(structures);
});

// @desc    Create new fee structure
// @route   POST /api/fee-structures
// @access  Private (Admin)
const createFeeStructure = asyncHandler(async (req, res) => {
    const { classId, type, amount, description, academicYear, dueDate } = req.body;

    const structure = await FeeStructure.create({
        class: classId,
        type,
        amount,
        description,
        academicYear,
        dueDate
    });

    res.status(201).json(structure);
});

// @desc    Generate Invoices for Grid
// @route   POST /api/fee-structures/:id/generate
// @access  Private (Admin)
const generateInvoices = asyncHandler(async (req, res) => {
    const structure = await FeeStructure.findById(req.params.id);

    if (!structure) {
        res.status(404);
        throw new Error('Fee Structure not found');
    }

    // Find all students in this class
    const students = await Student.find({ class: structure.class });
    
    if (students.length === 0) {
        res.status(400);
        throw new Error('No students found in this class');
    }

    let createdCount = 0;

    for (const student of students) {
        // Check if fee already exists to prevent duplicate invoicing
        const existingFee = await Fee.findOne({
            student: student._id,
            type: structure.type,
            academicYear: structure.academicYear
        });

        if (!existingFee) {
            await Fee.create({
                student: student._id,
                amount: structure.amount,
                type: structure.type,
                dueDate: structure.dueDate,
                academicYear: structure.academicYear,
                status: 'Pending'
            });
            createdCount++;
        }
    }

    res.json({ message: `Generated ${createdCount} invoices for ${structure.type} Fee` });
});

// @desc    Delete fee structure
// @route   DELETE /api/fee-structures/:id
// @access  Private (Admin)
const deleteFeeStructure = asyncHandler(async (req, res) => {
    const structure = await FeeStructure.findById(req.params.id);

    if (structure) {
        await structure.deleteOne();
        res.json({ message: 'Fee Structure removed' });
    } else {
        res.status(404);
        throw new Error('Fee Structure not found');
    }
});

module.exports = {
    getFeeStructures,
    createFeeStructure,
    generateInvoices,
    deleteFeeStructure
};
