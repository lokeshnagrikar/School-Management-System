const Student = require('../models/Student');
const Timetable = require('../models/Timetable');
const Class = require('../models/Class');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find().populate('class', 'name');
  res.json(students);
});

// @desc    Create a student
// @route   POST /api/students
// @access  Private/Admin
const createStudent = asyncHandler(async (req, res) => {
  const { name, email, admissionNumber, class: classId, section, parentName, phone, password } = req.body;

  // 1. Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  // 2. Create User first
  const user = await User.create({
    name,
    email,
    password, 
    role: 'STUDENT',
  });

  if (user) {
    // 3. Create Student Profile
    const student = await Student.create({
      user: user._id,
      name,
      email,
      admissionNumber,
      class: classId,
      section,
      parentName,
      phone,
    });

    res.status(201).json(student);
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (student) {
    // Delete associated User account
    await User.findByIdAndDelete(student.user);
    await student.deleteOne();
    res.json({ message: 'Student removed' });
  } else {
    res.status(404);
    throw new Error('Student not found');
  }
});

// @desc    Get Student Dashboard Data
// @route   GET /api/students/dashboard
// @access  Private (Student)
const getDashboardData = async (req, res) => {
  try {
    // 1. Find the Student record linked to the logged-in User
    const student = await Student.findOne({ user: req.user._id });

    if (!student) {
      // Handle case for auto-registered Google users who haven't been assigned a class yet
      return res.status(200).json({
        message: 'Student profile incomplete',
        classTeacher: null,
        schedule: [],
        attendancePercent: 0, 
        assignmentsPending: 0
      });
    }

    // 2. Get Class Info (including Class Teacher)
    let classTeacher = null;
    if (student.class) {
        const classInfo = await Class.findById(student.class).populate('classTeacher', 'name email photoPath');
        if (classInfo && classInfo.classTeacher) {
            classTeacher = classInfo.classTeacher;
        }
    }

    // 3. Get Today's Timetable
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    
    let todaysSchedule = [];
    if (student.class && student.section) {
        const timetable = await Timetable.findOne({ 
            class: student.class, 
            section: student.section, 
            day: today 
        })
        .populate('periods.subject', 'name')
        .populate('periods.teacher', 'name');

        if (timetable) {
            todaysSchedule = timetable.periods;
        }
    }

    res.json({
        classTeacher,
        schedule: todaysSchedule,
        // Dummies for now (could be real later)
        attendancePercent: 92,
        assignmentsPending: 4,
        upcomingEvents: 2
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getAllStudents,
  createStudent,
  deleteStudent,
  getDashboardData,
};
