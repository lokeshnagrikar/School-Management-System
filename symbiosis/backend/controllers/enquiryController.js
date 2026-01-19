const asyncHandler = require('express-async-handler');
const Enquiry = require('../models/Enquiry');

// @desc    Create new enquiry
// @route   POST /api/enquiries
// @access  Public
const createEnquiry = asyncHandler(async (req, res) => {
  const { studentName, parentName, email, phone, grade, message } = req.body;
  const enquiry = await Enquiry.create({
    studentName,
    parentName,
    email,
    phone,
    grade,
    message,
  });
  
  // Send email notification to Admin here (using Nodemailer)
  // ...

  res.status(201).json(enquiry);
});

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private/Admin
const getEnquiries = asyncHandler(async (req, res) => {
  const enquiries = await Enquiry.find().sort({ createdAt: -1 });
  res.json(enquiries);
});

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id
// @access  Private/Admin
const updateEnquiryStatus = asyncHandler(async (req, res) => {
    const enquiry = await Enquiry.findById(req.params.id);
    if(enquiry) {
        enquiry.status = req.body.status || enquiry.status;
        const updatedEnquiry = await enquiry.save();
        res.json(updatedEnquiry);
    } else {
        res.status(404);
        throw new Error('Enquiry not found');
    }
});

module.exports = { createEnquiry, getEnquiries, updateEnquiryStatus };
