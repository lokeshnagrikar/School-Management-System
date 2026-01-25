const asyncHandler = require('express-async-handler');
const Exam = require('../models/Exam');
const Result = require('../models/Result');
const Class = require('../models/Class');
const Student = require('../models/Student');
const Subject = require('../models/Subject');

// @desc    Create Exam (Term)
// @route   POST /api/exams
// @access  Private/Admin
const createExam = asyncHandler(async (req, res) => {
    const { name, academicYear, term, classes, startDate, endDate } = req.body;

    const exam = await Exam.create({
        name,
        academicYear,
        term,
        classes,
        startDate,
        endDate
    });

    res.status(201).json(exam);
});

// @desc    Get All Exams
// @route   GET /api/exams
// @access  Private
const getExams = asyncHandler(async (req, res) => {
    const exams = await Exam.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(exams);
});

// @desc    Enter/Update Marks
// @route   POST /api/exams/marks
// @access  Private/Teacher
const enterMarks = asyncHandler(async (req, res) => {
    // Expects bulk data or per student?
    // Let's do per student or per class/subject batch.
    // Batch is better: { examId, classId, subjectId, marks: [{ studentId, marksObtained, totalMarks }] }
    
    const { examId, classId, subjectId, marks } = req.body;

    // Validate Exam
    const exam = await Exam.findById(examId);
    if (!exam) {
        res.status(404);
        throw new Error('Exam not found');
    }

    // Process each mark entry
    for (const entry of marks) {
        const { studentId, marksObtained, totalMarks } = entry;

        // Find existing Result for student & exam
        let result = await Result.findOne({ exam: examId, student: studentId });

        if (!result) {
            // Create new
            result = new Result({
                exam: examId,
                student: studentId,
                class: classId,
                subjects: []
            });
        }

        // Update/Add Subject Marks
        const subIndex = result.subjects.findIndex(s => s.subject.toString() === subjectId);
        
        if (subIndex > -1) {
            // Update
            result.subjects[subIndex].marksObtained = marksObtained;
            result.subjects[subIndex].totalMarks = totalMarks;
        } else {
            // Add
            result.subjects.push({
                subject: subjectId,
                marksObtained,
                totalMarks
            });
        }

        // Recalculate Totals
        let totalObt = 0;
        let totalMax = 0;
        
        result.subjects.forEach(s => {
            totalObt += s.marksObtained;
            totalMax += s.totalMarks;
        });

        result.totalObtained = totalObt;
        result.totalMax = totalMax;
        
        if (totalMax > 0) {
            result.percentage = (totalObt / totalMax) * 100;
             // Simple Grading Logic
             if (result.percentage >= 90) result.grade = 'A+';
             else if (result.percentage >= 80) result.grade = 'A';
             else if (result.percentage >= 70) result.grade = 'B';
             else if (result.percentage >= 60) result.grade = 'C';
             else if (result.percentage >= 50) result.grade = 'D';
             else result.grade = 'F';
        }

        await result.save();
    }

    res.json({ message: 'Marks updated successfully' });
});

// @desc    Get Student Result (Report Card)
// @route   GET /api/exams/results/student/:studentId
// @access  Private/Student/Parent
const getStudentResults = asyncHandler(async (req, res) => {
    let { studentId } = req.params;
    
    // Resolve 'me' to actual Student Profile ID
    if (studentId === 'me') {
        if (req.user.role === 'STUDENT') {
            const student = await Student.findOne({ user: req.user._id });
            if (!student) {
                res.status(404);
                throw new Error('Student profile not found');
            }
            studentId = student._id;
        } else {
             res.status(400);
             throw new Error('Valid student ID required for non-students');
        }
    }

    // Get all results for this student populated with details
    const results = await Result.find({ student: studentId })
        .populate('exam', 'name academicYear term')
        .populate('subjects.subject', 'name code')
        .sort({ createdAt: -1 });

    res.json(results);
});


// @desc    Get Class Results (For Teacher View)
// @route   GET /api/exams/results/class/:classId/:examId
// @access  Private/Teacher
const getClassResults = asyncHandler(async (req, res) => {
    const { classId, examId } = req.params;

    const results = await Result.find({ class: classId, exam: examId })
        .populate('student', 'name admissionNumber rollNumber')
        .populate('subjects.subject', 'name');
    
    res.json(results);
});


module.exports = {
    createExam,
    getExams,
    enterMarks,
    getStudentResults,
    getClassResults
};
