const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Student = require('../models/Student');
const Staff = require('../models/Staff');
const Activity = require('../models/Activity');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/emailService');
const crypto = require('crypto');

// Helper to log activity
const logActivity = async (userId, action, description, req) => {
    try {
        await Activity.create({
            user: userId,
            action,
            description,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent']
        });
    } catch (error) {
        console.error('Activity Log Error:', error);
        // Don't fail the request just because logging failed
    }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Log Activity
    await logActivity(user._id, 'LOGIN', 'System Login via Web', req);

    res.json({
      token: generateToken(user._id),
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage, // Added this
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user (Admin mainly, or public student registration?)
// @route   POST /api/users
// @access  Public (or Admin protected based on requirements)
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'STUDENT',
  });

  if (user) {
    await logActivity(user._id, 'REGISTER', 'New Account Registration', req);

    res.status(201).json({
      token: generateToken(user._id),
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage, 
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  console.log('Update Profile Request Body:', req.body);
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    if (req.body.profileImage) {
        user.profileImage = req.body.profileImage;
    }

    try {
        const updatedUser = await user.save();
        console.log('User saved successfully:', updatedUser); // Debug log

        await logActivity(user._id, 'UPDATE_PROFILE', 'Updated profile details', req);

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            profileImage: updatedUser.profileImage,
            token: generateToken(updatedUser._id),
        });
    } catch (saveError) {
        console.error('Error saving user:', saveError); // Critical Debug Log
        res.status(500);
        throw new Error('Update failed: ' + saveError.message);
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Change user password
// @route   PUT /api/users/password
// @access  Private
const changeUserPassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(currentPassword))) {
        user.password = newPassword;
        await user.save();
        
        // Log activity
        await logActivity(user._id, 'CHANGE_PASSWORD', 'Changed account password', req);

        res.json({ message: 'Password updated successfully' });
    } else {
        res.status(401);
        throw new Error('Invalid current password');
    }
});

// @desc    Upload profile image
// @route   POST /api/users/profile/image
// @access  Private
const uploadUserProfileImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('No image file uploaded');
    }

    const user = await User.findById(req.user._id);

    if (user) {
        const imagePath = `/${req.file.path.replace(/\\/g, '/')}`;
        user.profileImage = imagePath;
        const updatedUser = await user.save();

        // Sync with Role-Specific Models
        if (user.role === 'STUDENT') {
            await Student.findOneAndUpdate({ user: user._id }, { profileImage: imagePath });
        } else if (user.role === 'TEACHER' || user.role === 'ADMIN') { // Assuming Admins might be Staff too
            await Staff.findOneAndUpdate({ user: user._id }, { photoPath: imagePath });
        }

        await logActivity(user._id, 'UPLOAD_IMAGE', 'Updated profile picture', req);

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            profileImage: updatedUser.profileImage,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get recent activity logs
// @route   GET /api/users/activity
// @access  Private
const getRecentActivity = asyncHandler(async (req, res) => {
    const logs = await Activity.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(5); // Last 5 activities
    res.json(logs);
});

// @desc    Forgot Password - Send OTP
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash OTP before saving (optional but recommended for security) - keeping simple for now or hash if preferred
    // For simplicity in this demo, saving plain OTP. In prod, hash it.
    user.resetPasswordOtp = otp;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 Minutes

    await user.save();

    const message = `
      <h1>Password Reset Request</h1>
      <p>Your OTP for password reset is: <strong>${otp}</strong></p>
      <p>This OTP is valid for 10 minutes.</p>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset OTP',
            message,
        });

        res.status(200).json({ success: true, message: 'Email sent' });
    } catch (error) {
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(500);
        throw new Error('Email could not be sent');
    }
});

// @desc    Reset Password
// @route   POST /api/users/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, password } = req.body;

    const user = await User.findOne({
        email,
        resetPasswordOtp: otp,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid OTP or expired');
    }

    user.password = password;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    
    await logActivity(user._id, 'RESET_PASSWORD', 'Password reset via OTP', req);

    res.status(200).json({ success: true, message: 'Password reset successful' });
});

module.exports = { 
    authUser, 
    registerUser, 
    getUserProfile, 
    updateUserProfile, 
    uploadUserProfileImage, 
    getRecentActivity, 
    changeUserPassword,
    forgotPassword,
    resetPassword
};
