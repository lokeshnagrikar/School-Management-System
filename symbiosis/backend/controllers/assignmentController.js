const asyncHandler = require('express-async-handler');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Staff = require('../models/Staff');
const Student = require('../models/Student');

const { sendNotificationToClass } = require('../utils/notificationHelper');

// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Private/Teacher
const createAssignment = asyncHandler(async (req, res) => {
    const { title, description, classId, subjectId, deadline, fileUrl, maxMarks } = req.body;

    const teacher = await Staff.findOne({ user: req.user._id });
    if (!teacher) {
        res.status(404);
        throw new Error('Teacher profile not found');
    }

    const assignment = await Assignment.create({
        title,
        description,
        class: classId,
        subject: subjectId,
        deadline,
        fileUrl,
        teacher: req.user._id,
        maxMarks,
    });

    // Notify Students
    await sendNotificationToClass(classId, `New Assignment: ${title}`, 'info', `/dashboard/assignments`);

    res.status(201).json(assignment);
});

// @desc    Get assignments
// @route   GET /api/assignments
// @access  Private
const getAssignments = asyncHandler(async (req, res) => {
    let query = {};

    if (req.user.role === 'TEACHER') {
        const teacher = await Staff.findOne({ user: req.user._id });
        // Teachers see assignments they created
        query = { teacher: req.user._id };
    } else if (req.user.role === 'STUDENT') {
        const student = await Student.findOne({ user: req.user._id });
        if (!student) {
            res.status(404);
            throw new Error('Student profile not found');
        }
        // Students see active assignments for their class
        query = { 
            class: student.currentClass,
            isActive: true 
        };
    } else {
         res.status(403);
         throw new Error('Not authorized to view assignments');
    }

    const assignments = await Assignment.find(query)
        .populate('subject', 'name')
        .populate('class', 'name grade section')
        .sort({ deadline: 1 }); // Closest deadline first

    res.json(assignments);
});

// @desc    Submit an assignment
// @route   POST /api/assignments/:id/submit
// @access  Private/Student
const submitAssignment = asyncHandler(async (req, res) => {
    const { fileUrl } = req.body;
    const assignmentId = req.params.id;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
        res.status(404);
        throw new Error('Assignment not found');
    }

    // Check if late
    const isLate = new Date() > new Date(assignment.deadline);

    // Check for existing submission
    const existingSubmission = await Submission.findOne({
        assignment: assignmentId,
        student: req.user._id
    });

    if (existingSubmission) {
        res.status(400);
        throw new Error('You have already submitted this assignment');
    }

    const submission = await Submission.create({
        assignment: assignmentId,
        student: req.user._id,
        fileUrl,
        status: isLate ? 'late' : 'submitted'
    });

    res.status(201).json(submission);
});

// @desc    Get submissions for an assignment
// @route   GET /api/assignments/:id/submissions
// @access  Private/Teacher
const getSubmissions = asyncHandler(async (req, res) => {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
        res.status(404);
        throw new Error('Assignment not found');
    }

    if (assignment.teacher.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to view these submissions');
    }

    const submissions = await Submission.find({ assignment: req.params.id })
        .populate('student', 'name email')
        .sort({ submittedAt: -1 });

    res.json(submissions);
});

// @desc    Grade a submission
// @route   PUT /api/assignments/submissions/:id
// @access  Private/Teacher
const gradeSubmission = asyncHandler(async (req, res) => {
    const { grade, feedback } = req.body;
    const submission = await Submission.findById(req.params.id).populate('assignment');

    if (!submission) {
        res.status(404);
        throw new Error('Submission not found');
    }

    // Verify teacher owns the assignment
    if (submission.assignment.teacher.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to grade this submission');
    }

    submission.grade = grade;
    submission.feedback = feedback;
    submission.status = 'graded';
    
    await submission.save();

    res.json(submission);
});

module.exports = {
    createAssignment,
    getAssignments,
    submitAssignment,
    getSubmissions,
    gradeSubmission
};
