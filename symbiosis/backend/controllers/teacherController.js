const asyncHandler = require('express-async-handler');
const Staff = require('../models/Staff');
const Student = require('../models/Student');
const Timetable = require('../models/Timetable');

// @desc    Get teacher dashboard stats
// @route   GET /api/teacher/stats
// @access  Private/Teacher
const getTeacherDashboardStats = asyncHandler(async (req, res) => {
    // 1. Find Staff profile link to User
    const staff = await Staff.findOne({ user: req.user._id });

    if (!staff) {
        res.status(404);
        throw new Error('Teacher profile not found');
    }

    // 2. Count Assigned Classes
    const assignedClassesCount = staff.assignedSubjects ? staff.assignedSubjects.length : 0;

    // 3. Count Total Students in Assigned Classes
    let totalStudents = 0;
    if (staff.assignedSubjects && staff.assignedSubjects.length > 0) {
        const classIds = staff.assignedSubjects.map(sub => sub.class);
        // Count students where class matches any of the assigned classes
        totalStudents = await Student.countDocuments({ class: { $in: classIds } });
    }

    // 4. Count Today's Classes
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];

    // Find timetables for today where periods.teacher matches staff._id
    const timetablesToday = await Timetable.find({
        day: today,
        'periods.teacher': staff._id
    });

    // Calculate total periods for today
    let classesTodayCount = 0;
    timetablesToday.forEach(tt => {
        const periodCount = tt.periods.filter(p => p.teacher && p.teacher.toString() === staff._id.toString()).length;
        classesTodayCount += periodCount;
    });


    res.json({
        totalClassesAssigned: assignedClassesCount,
        totalStudents: totalStudents,
        classesToday: classesTodayCount
    });
});

// @desc    Get teacher schedule
// @route   GET /api/teacher/schedule
// @access  Private/Teacher
const getTeacherSchedule = asyncHandler(async (req, res) => {
    const staff = await Staff.findOne({ user: req.user._id });

    if (!staff) {
        res.status(404);
        throw new Error('Teacher profile not found');
    }

    // Get today's day name (e.g., "Monday")
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];

    // Find all timetables that include this teacher
    // We want specifically for TODAY initially, or we could return whole week
    // Let's return Today's schedule specifically for the dashboard widget
    const timetables = await Timetable.find({
        day: today,
        'periods.teacher': staff._id
    })
    .populate('class', 'name section') // Get Class Name e.g. "10", "A"
    .populate('periods.subject', 'name'); // Get Subject Name

    let todaySchedule = [];

    timetables.forEach(tt => {
        // Filter periods for this teacher
        const teacherPeriods = tt.periods.filter(p => p.teacher && p.teacher.toString() === staff._id.toString());
        
        teacherPeriods.forEach(p => {
            todaySchedule.push({
                id: p._id,
                startTime: p.startTime,
                endTime: p.endTime,
                class: tt.class.name,
                section: tt.section,
                subject: p.subject.name
            });
        });
    });

    // Sort by start time
    todaySchedule.sort((a, b) => a.startTime.localeCompare(b.startTime));

    res.json(todaySchedule);
});

module.exports = { getTeacherDashboardStats, getTeacherSchedule };
