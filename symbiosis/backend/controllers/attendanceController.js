const asyncHandler = require('express-async-handler');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Staff = require('../models/Staff');

// @desc    Mark attendance for a class
// @route   POST /api/attendance
// @access  Private/Teacher
const markAttendance = asyncHandler(async (req, res) => {
    const { classId, date, records } = req.body; // records: [{ studentId, status }]

    const teacher = await Staff.findOne({ user: req.user._id });
    if (!teacher) {
        res.status(404);
        throw new Error('Teacher profile not found');
    }

    // Process each student record
    const operations = records.map(record => {
        return {
            updateOne: {
                filter: { student: record.studentId, date: date },
                update: {
                    $set: {
                        student: record.studentId,
                        class: classId,
                        date: date,
                        status: record.status,
                        teacher: teacher._id
                    }
                },
                upsert: true 
            }
        };
    });

    await Attendance.bulkWrite(operations);

    res.status(201).json({ message: 'Attendance marked successfully', date });
});

// @desc    Get attendance for a class on a date
// @route   GET /api/attendance/:classId/:date
// @access  Private/Teacher/Admin
const getAttendance = asyncHandler(async (req, res) => {
    const { classId, date } = req.params;

    const attendanceKeys = await Attendance.find({ class: classId, date: date });
    res.json(attendanceKeys);
});

module.exports = { markAttendance, getAttendance };
