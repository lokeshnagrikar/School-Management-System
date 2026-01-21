const asyncHandler = require('express-async-handler');
const Timetable = require('../models/Timetable');

// @desc    Get timetable for a class
// @route   GET /api/timetable/class/:classId
// @access  Private
const getClassTimetable = asyncHandler(async (req, res) => {
    const query = { class: req.params.classId };
    
    // Support filtering by section (optional but recommended)
    if (req.query.section) {
        query.section = req.query.section;
    }

    const timetable = await Timetable.find(query)
        .populate('class', 'name section')
        .populate('periods.subject', 'name code')
        .populate('periods.teacher', 'name email');
    res.json(timetable);
});

// @desc    Create or Update Timetable for a Class and Day
// @route   POST /api/timetable
// @access  Private/Admin
const saveTimetable = asyncHandler(async (req, res) => {
    console.log("saveTimetable Request Body:", req.body); // DEBUG LOG
    const { classId, day, periods, section } = req.body; // periods: [{ startTime, endTime, subjectId, teacherId }]
    const sectionToUse = section || 'A'; // Default to 'A' if not specified

    if (!classId || !day) {
        res.status(400);
        throw new Error('Class ID and Day are required');
    }

    try {
        // Check if timetable exists for this class, section and day
        let timetable = await Timetable.findOne({ class: classId, section: sectionToUse, day: day });

        if (timetable) {
            console.log("Updating existing timetable id:", timetable._id);
            // Update existing
            timetable.periods = periods.map(p => ({
                startTime: p.startTime,
                endTime: p.endTime,
                subject: p.subjectId,
                teacher: p.teacherId
            }));
            const updatedTimetable = await timetable.save();
            console.log("Updated successfully");
            res.json(updatedTimetable);
        } else {
            console.log("Creating new timetable");
            // Create new
            const newTimetable = new Timetable({
                class: classId,
                section: sectionToUse,
                day: day,
                periods: periods.map(p => ({
                    startTime: p.startTime,
                    endTime: p.endTime,
                    subject: p.subjectId,
                    teacher: p.teacherId
                }))
            });
            const savedTimetable = await newTimetable.save();
            console.log("Created successfully");
            res.status(201).json(savedTimetable);
        }
    } catch (error) {
        console.error("Error saving timetable:", error);
        res.status(500);
        throw new Error('Server Error Saving Timetable: ' + error.message);
    }
});

// @desc    Get all timetables (useful for checking conflicts or overview)
// @route   GET /api/timetable
// @access  Private/Admin
const getAllTimetables = asyncHandler(async (req, res) => {
    const timetables = await Timetable.find({})
        .populate('class', 'name section')
        .populate('periods.subject', 'name')
        .populate('periods.teacher', 'name');
    res.json(timetables);
});

module.exports = { getClassTimetable, saveTimetable, getAllTimetables };
