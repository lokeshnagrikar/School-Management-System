const asyncHandler = require('express-async-handler');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Class = require('../models/Class');

// @desc    Mark Attendance (Upsert)
// @route   POST /api/attendance
// @access  Private/Teacher/Admin
const markAttendance = asyncHandler(async (req, res) => {
    const { date, classId, records } = req.body;

    // 1. Check if record exists for this date and class
    // Normalize date to start of day to avoid time issues? 
    // Ideally frontend sends YYYY-MM-DD or ISO string.
    // Let's assume strict date matching for now or ranges.
    // Better: Query by range of day if passing full ISO.
    // For simplicity, let's assume 'date' passed from frontend is just YYYY-MM-DD string or normalize it.
    
    // Simplest: Frontend sends "2023-10-27" string.
    // But Mongoose store as Date.
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0,0,0,0);
    
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23,59,59,999);

    let attendance = await Attendance.findOne({
        class: classId,
        date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (attendance) {
        // Update existing
        attendance.records = records;
        attendance.teacher = req.user._id; // Update who modified last
        await attendance.save();
        res.json({ message: 'Attendance updated successfully', _id: attendance._id });
    } else {
        // Create new
        attendance = await Attendance.create({
            date: startOfDay, // Store normalized
            class: classId,
            teacher: req.user._id,
            records: records
        });
        res.status(201).json({ message: 'Attendance marked successfully', _id: attendance._id });
    }
});

// @desc    Get Attendance for a Class on a Date
// @route   GET /api/attendance/class/:classId
// @access  Private/Teacher/Admin
const getClassAttendance = asyncHandler(async (req, res) => {
    const { classId } = req.params;
    const { date } = req.query; // YYYY-MM-DD

    if (!date) {
        res.status(400);
        throw new Error('Date is required');
    }

    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0,0,0,0);
    
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23,59,59,999);

    const attendance = await Attendance.findOne({
        class: classId,
        date: { $gte: startOfDay, $lte: endOfDay }
    }).populate('records.student', 'name admissionNumber rollNumber');

    if (attendance) {
        res.json(attendance);
    } else {
        // Return empty structure if not marked, so frontend can show "Not Marked" or empty form
        res.json(null);
    }
});

// @desc    Get Attendance History for a Student
// @route   GET /api/attendance/student/:studentId
// @access  Private/Student/Parent/Admin
const getStudentAttendance = asyncHandler(async (req, res) => {
    const { studentId } = req.params;

    // Find all attendance records where this student exists in 'records' array
    const history = await Attendance.find({
        'records.student': studentId
    }).sort({ date: -1 });

    const formattedHistory = history.map(day => {
        const record = day.records.find(r => r.student.toString() === studentId);
        return {
            date: day.date,
            status: record ? record.status : 'Unknown', // Should not happen if query is correct
            remarks: record ? record.remarks : ''
        };
    });

    res.json(formattedHistory);
});

module.exports = {
    markAttendance,
    getClassAttendance,
    getStudentAttendance
};
