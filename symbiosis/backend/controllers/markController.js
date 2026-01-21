const asyncHandler = require('express-async-handler');
const Mark = require('../models/Mark');
const Staff = require('../models/Staff');

// @desc    Upload Marks
// @route   POST /api/marks
// @access  Private/Teacher
const uploadMarks = asyncHandler(async (req, res) => {
    const { classId, subjectId, examType, maxMarks, records } = req.body; // records: [{ studentId, marksObtained, remarks }]

    const teacher = await Staff.findOne({ user: req.user._id });
    if (!teacher) {
        res.status(404);
        throw new Error('Teacher profile not found');
    }

    // Process each student record
    const operations = records.map(record => {
        return {
            updateOne: {
                filter: { student: record.studentId, subject: subjectId, examType: examType },
                update: {
                    $set: {
                        student: record.studentId,
                        class: classId,
                        subject: subjectId,
                        examType: examType,
                        maxMarks: maxMarks,
                        marksObtained: record.marksObtained,
                        remarks: record.remarks,
                        teacher: teacher._id
                    }
                },
                upsert: true
            }
        };
    });

    await Mark.bulkWrite(operations);

    res.status(201).json({ message: 'Marks uploaded successfully', count: records.length });
});

// @desc    Get Marks for a Class/Subject/Exam
// @route   GET /api/marks/:classId/:subjectId/:examType
// @access  Private/Teacher/Admin
const getMarks = asyncHandler(async (req, res) => {
    const { classId, subjectId, examType } = req.params;
    
    let query = { class: classId, subject: subjectId, examType: examType };

    if (req.user.role === 'STUDENT') {
        const student = await Student.findOne({ user: req.user._id });
        if (!student) {
            res.status(404);
            throw new Error('Student profile not found');
        }
        // Ensure student is searching for their own class? 
        // Or if they know the params, they only get THEIR mark.
        // Let's force filter by student ID
        query.student = student._id; 
    }
    // Teachers/Admins get all marks for that class/subject/exam

    const marks = await Mark.find(query).populate('student', 'name admissionNumber');
    res.json(marks);
});

module.exports = { uploadMarks, getMarks };
