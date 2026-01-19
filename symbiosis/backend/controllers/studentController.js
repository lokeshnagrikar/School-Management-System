const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const User = require('../models/User');

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin/Teacher
const getStudents = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Student.countDocuments({ ...keyword });
  const students = await Student.find({ ...keyword })
    .populate('class', 'name')
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ students, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id)
    .populate('class', 'name')
    .populate('user', 'email');

  if (student) {
    res.json(student);
  } else {
    res.status(404);
    throw new Error('Student not found');
  }
});

// @desc    Create a student profile
// @route   POST /api/students
// @access  Private/Admin
const createStudent = asyncHandler(async (req, res) => {
  const {
    name,
    admissionNumber,
    classId,
    section,
    parentName,
    phone,
    email,
    profileImage,
    status
  } = req.body;

  // Ideally, we should also check if a User exists for this student, or create one potentially.
  // For now, let's assume the user ID is passed or handled separately.
  // Requirement says: Admin creates student.
  // Should we auto-create a user account? Yes, usually.
  
  // Check if admission number exists
  const studentExists = await Student.findOne({ admissionNumber });
  if (studentExists) {
    res.status(400);
    throw new Error('Student with this admission number already exists');
  }

  // Auto-create User account for the student?
  // Let's create a User first. 
  // Password default: 123456 (should be changed) or generated.
  
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    password: 'password123', // Default password
    role: 'STUDENT',
  });

  try {
      const student = await Student.create({
        user: user._id,
        name,
        admissionNumber,
        class: classId,
        section,
        parentName,
        phone,
        email,
        profileImage,
        status,
      });

      res.status(201).json(student);
  } catch (error) {
      // Rollback user creation if student creation fails
      await User.findByIdAndDelete(user._id);
      res.status(400);
      throw new Error('Invalid student data: ' + error.message);
  }
});

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (student) {
    student.name = req.body.name || student.name;
    student.class = req.body.classId || student.class;
    student.section = req.body.section || student.section;
    student.parentName = req.body.parentName || student.parentName;
    student.phone = req.body.phone || student.phone;
    student.status = req.body.status || student.status;
    student.profileImage = req.body.profileImage || student.profileImage;

    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } else {
    res.status(404);
    throw new Error('Student not found');
  }
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (student) {
    // Optionally delete the associated user
    await User.findByIdAndDelete(student.user);
    await student.deleteOne();
    res.json({ message: 'Student removed' });
  } else {
    res.status(404);
    throw new Error('Student not found');
  }
});

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
