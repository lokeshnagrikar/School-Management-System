const express = require('express');
const router = express.Router();
const {
    createAssignment,
    getAssignments,
    submitAssignment,
    getSubmissions,
    gradeSubmission
} = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Base Route: /api/assignments

router.route('/')
    .post(protect, authorize('TEACHER'), createAssignment)
    .get(protect, getAssignments); // Students and Teachers

router.route('/:id/submit')
    .post(protect, authorize('STUDENT'), submitAssignment);

router.route('/:id/submissions')
    .get(protect, authorize('TEACHER'), getSubmissions);

router.route('/submissions/:id') // Submission ID
    .put(protect, authorize('TEACHER'), gradeSubmission);

module.exports = router;
