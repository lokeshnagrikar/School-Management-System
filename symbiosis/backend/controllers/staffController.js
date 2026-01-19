const asyncHandler = require('express-async-handler');
const Staff = require('../models/Staff');
const User = require('../models/User');

// @desc    Get all staff
// @route   GET /api/staff
// @access  Public
const getStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.find().populate('assignedSubjects.subject', 'name').populate('assignedSubjects.class', 'name');
  res.json(staff);
});

// @desc    Create staff member
// @route   POST /api/staff
// @access  Private/Admin
const createStaff = asyncHandler(async (req, res) => {
  const { name, email, position, bio, photoPath, assignedSubjects } = req.body;

  const staffExists = await Staff.findOne({ email }); // Using email as unique ID in staff possibly

  if (staffExists) {
    res.status(400);
    throw new Error('Staff member already exists');
  }

  // Create User account?
  const userExists = await User.findOne({ email });
  if (userExists) {
      res.status(400);
      throw new Error('User email already exists');
  }

  const user = await User.create({
      name,
      email,
      password: 'password123',
      role: 'TEACHER', // Or derive from position?
  });

  const staff = await Staff.create({
    user: user._id,
    name,
    email,
    position,
    bio,
    photoPath,
    assignedSubjects,
  });

  res.status(201).json(staff);
});

// @desc    Delete staff
// @route   DELETE /api/staff/:id
// @access  Private/Admin
const deleteStaff = asyncHandler(async (req, res) => {
    const staff = await Staff.findById(req.params.id);

    if (staff) {
        await staff.deleteOne();
        res.json({ message: 'Staff removed' });
    } else {
        res.status(404);
        throw new Error('Staff not found');
    }
});

// @desc    Update staff
// @route   PUT /api/staff/:id
// @access  Private/Admin
// @desc    Update staff
// @route   PUT /api/staff/:id
// @access  Private/Admin
const updateStaff = asyncHandler(async (req, res) => {
    console.log(`[Update] Staff ID: ${req.params.id} Body:`, req.body);
    const staff = await Staff.findById(req.params.id);

    if (staff) {
        // If email is changing, check if new email is already taken by another user
        if (req.body.email && req.body.email !== staff.email) {
            const userExists = await User.findOne({ email: req.body.email });
             if (userExists) {
                res.status(400);
                throw new Error('Email already already in use');
            }
        }

        staff.name = req.body.name || staff.name;
        staff.email = req.body.email || staff.email;
        staff.position = req.body.position || staff.position;
        
        // Update linked User account
        if (staff.user) {
            const user = await User.findById(staff.user);
            if (user) {
                user.name = req.body.name || user.name;
                user.email = req.body.email || user.email;
                if (req.body.password) {
                    user.password = req.body.password;
                }
                await user.save();
             }
        } else {
             // Optional: Create user if missing? For now just log.
             console.log('[Update] Warning: Staff has no linked User account');
        }

        const updatedStaff = await staff.save();
        res.json(updatedStaff);
    } else {
        res.status(404);
        throw new Error('Staff not found');
    }
});

module.exports = { getStaff, createStaff, deleteStaff, updateStaff };
