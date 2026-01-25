const Student = require('../models/Student');
const Timetable = require('../models/Timetable');
const Class = require('../models/Class');
const User = require('../models/User');
const Staff = require('../models/Staff');
const asyncHandler = require('express-async-handler');
const sendEmail = require('../utils/emailService');

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin/Teacher
const getAllStudents = asyncHandler(async (req, res) => {
  let query = {};

  // If user is a Teacher, filter by their assigned classes
  if (req.user.role === 'TEACHER') {
    const staffProfile = await Staff.findOne({ user: req.user._id });
    
    if (staffProfile) {
        // Collect class IDs from assignedSubjects
        const assignedClassIds = staffProfile.assignedSubjects.map(sub => sub.class);
        
        // Also check if they are a classTeacher for any class
        const classTeacherClasses = await Class.find({ classTeacher: staffProfile._id });
        const classTeacherClassIds = classTeacherClasses.map(c => c._id);

        const allClassIds = [...new Set([...assignedClassIds, ...classTeacherClassIds])].map(id => id.toString());

        if (allClassIds.length > 0) {
             // If query has class, verify it's allowed
             if (req.query.class) {
                if (allClassIds.includes(req.query.class)) {
                    query.class = req.query.class;
                } else {
                    return res.json([]); // Unauthorized for this class
                }
             } else {
                query.class = { $in: allClassIds };
             }
        } else {
            // Teacher has no classes, return empty
             return res.json([]);
        }
    } else {
        return res.json([]);
    }
  } else if (req.user.role === 'ADMIN' && req.query.class) {
      // Allow Admin to filter by class
      query.class = req.query.class;
  }

  const students = await Student.find(query).populate('class', 'name');
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
    try {
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
    } catch (error) {
        // ROLLBACK: Delete the user if student creation fails
        await User.findByIdAndDelete(user._id);
        res.status(400);
        throw new Error('Invalid student data: ' + error.message);
    }
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
    const student = await Student.findOne({ user: req.user._id });

    if (!student) {
      return res.status(200).json({
        message: 'Student profile incomplete',
        classTeacher: null,
        schedule: [],
        attendancePercent: 0,
        assignmentsPending: 0,
        upcomingEvents: 0,
        nextClass: null,
        recentNotices: []
      });
    }

    // 1. Class & Teacher Info
    let classTeacher = null;
    if (student.class) {
        const classInfo = await Class.findById(student.class).populate('classTeacher', 'name email photoPath');
        if (classInfo && classInfo.classTeacher) {
            classTeacher = classInfo.classTeacher;
        }
    }

    // 2. Timetable (Today's Schedule) & Next Class
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    
    let todaysSchedule = [];
    let nextClass = null;

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

            // Find Next Class logic (simplified)
            // Assuming periods have start/end times like "09:00" (24h or AM/PM needs parsing)
            // For now, let's just pick the first one for "today" as "Next Class" if it's morning, 
            // or just placeholder logic if time parsing is complex without a library.
            // Let's assume the first period is the next class for simplicity or the one after current time if possible.
            if (todaysSchedule.length > 0) {
                 nextClass = todaysSchedule[0].subject ? todaysSchedule[0].subject.name : 'Free Period';
            }
        }
    }

    // 3. Attendance Percentage
    // Count total records for this student
    const totalAttendance = await require('../models/Attendance').countDocuments({ student: student._id });
    const presentAttendance = await require('../models/Attendance').countDocuments({ 
        student: student._id, 
        status: { $in: ['Present', 'Late'] } 
    });
    
    const attendancePercent = totalAttendance > 0 
        ? Math.round((presentAttendance / totalAttendance) * 100) 
        : 0;

    // 4. Pending Assignments
    const Assignment = require('../models/Assignment');
    const Submission = require('../models/Submission');
    
    // Find active assignments for the class due in the future
    const activeAssignments = await Assignment.find({ 
        class: student.class, 
        deadline: { $gt: new Date() },
        isActive: true
    }).select('_id');

    // Find which ones this student has submitted
    const mySubmissions = await Submission.find({ 
        student: req.user._id, 
        assignment: { $in: activeAssignments.map(a => a._id) } 
    }).select('assignment');

    const assignmentsPending = activeAssignments.length - mySubmissions.length;

    // 5. Upcoming Events
    const Event = require('../models/Event');
    const upcomingEvents = await Event.countDocuments({ date: { $gte: new Date() } });

    // 6. Recent Notices
    const Notice = require('../models/Notice');
    const recentNotices = await Notice.find({ 
        $or: [{ targetClass: null }, { targetClass: student.class }] 
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('postedBy', 'name');

    res.json({
        classTeacher,
        schedule: todaysSchedule,
        attendancePercent,
        assignmentsPending: Math.max(0, assignmentsPending),
        upcomingEvents,
        nextClass: nextClass || 'None',
        recentNotices
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (student) {
    student.name = req.body.name || student.name;
    student.admissionNumber = req.body.admissionNumber || student.admissionNumber;
    student.class = req.body.classId || student.class;
    student.section = req.body.section || student.section;
    student.parentName = req.body.parentName || student.parentName;
    student.phone = req.body.phone || student.phone;
    student.email = req.body.email || student.email;
    student.status = req.body.status || student.status;

    const updatedStudent = await student.save();

    // Also update the linked User account
    const user = await User.findById(student.user);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password; 
        }
        await user.save();
    }

    res.json(updatedStudent);
  } else {
    res.status(404);
    throw new Error('Student not found');
  }
});

module.exports = {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getDashboardData,
};
