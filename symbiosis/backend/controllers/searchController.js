const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const Staff = require('../models/Staff');
// const Notice = require('../models/Notice'); // Access Notice via CMS or generic model if available. Using basic text search for now.

// @desc    Search across different collections
// @route   GET /api/search
// @access  Private
const globalSearch = asyncHandler(async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.json({ students: [], staff: [] });
    }

    const regex = new RegExp(query, 'i'); // Case-insensitive regex

    // robust search for students
    const students = await Student.find({
        $or: [
            { name: regex },
            { admissionNumber: regex }
        ]
    }).select('name admissionNumber class section profileImage').limit(5);

    // robust search for staff
    const staff = await Staff.find({
        $or: [
            { name: regex },
            { email: regex },
            { employeeId: regex }
        ]
    }).select('name employeeId designation department photoPath').limit(5);

    // Placeholder for notices if model exists
    // const notices = await Notice.find({ title: regex }).select('title date').limit(5);

    res.json({
        students,
        staff,
        // notices
    });
});

module.exports = {
    globalSearch
};
