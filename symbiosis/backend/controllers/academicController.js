const asyncHandler = require('express-async-handler');
const Class = require('../models/Class');
const Subject = require('../models/Subject');

// @desc    Get all classes
// @route   GET /api/academic/classes
// @access  Public
const getClasses = asyncHandler(async (req, res) => {
  const classes = await Class.find().populate('subjects');
  res.json(classes);
});

// @desc    Create a class
// @route   POST /api/academic/classes
// @access  Private/Admin
const createClass = asyncHandler(async (req, res) => {
  const { name, sections, subjects } = req.body;

  const classExists = await Class.findOne({ name });

  if (classExists) {
    res.status(400);
    throw new Error('Class already exists');
  }

  const newClass = await Class.create({
    name,
    sections,
    subjects,
  });

  res.status(201).json(newClass);
});

// @desc    Get all subjects
// @route   GET /api/academic/subjects
// @access  Public
const getSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find();
  res.json(subjects);
});

// @desc    Create a subject
// @route   POST /api/academic/subjects
// @access  Private/Admin
const createSubject = asyncHandler(async (req, res) => {
  const { name, code, description } = req.body;

  const subjectExists = await Subject.findOne({ code });

  if (subjectExists) {
    res.status(400);
    throw new Error('Subject already exists');
  }

  const subject = await Subject.create({
    name,
    code,
    description,
  });

  res.status(201).json(subject);
});

module.exports = {
  getClasses,
  createClass,
  getSubjects,
  createSubject,
};
