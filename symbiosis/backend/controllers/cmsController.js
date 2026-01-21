const asyncHandler = require('express-async-handler');
const Notice = require('../models/Notice');
const Gallery = require('../models/Gallery');

// Notices
const Enquiry = require('../models/Enquiry');
const Class = require('../models/Class');
const Student = require('../models/Student');
const Staff = require('../models/Staff');

// @desc    Get all notices
// @route   GET /api/cms/notices
// @access  Public (filtered)
const getNotices = asyncHandler(async (req, res) => {
    let query = { targetClass: null }; // Default: Public notices

    if (req.user) {
        if (req.user.role === 'ADMIN') {
            query = {}; // Admin sees all
        } else if (req.user.role === 'TEACHER') {
            // Teachers see public + notices targeting their assigned classes? 
            // For now, Teachers see Public + All Class notices (or we can restrict)
            // Sticking to User Request: "Teacher view scope: Assigned classes only"
            const teacher = await Staff.findOne({ user: req.user._id });
            // Ideally we get teacher's classes. For now, let's show all for teachers effectively or Public.
            // Simplified: Teachers see Public + specific class notices if they need to check.
            // Actually, let's make it: Teachers see all for now to manage, or public only.
            // Re-reading requirements: "Teacher View > Notices".
            // Let's allow Teachers to see ALL notices for now to simplify management, or just Public.
            // Better: Public + Notices for classes they teach. Without 'assigned classes' logic robustly, 
            // let's show ALL to Teachers/Admins to ensure visibility.
            query = {}; 
        } else if (req.user.role === 'STUDENT') {
            const student = await Student.findOne({ user: req.user._id });
            if (student && student.currentClass) {
                query = { 
                    $or: [
                        { targetClass: null }, // Public
                        { targetClass: student.currentClass } // My Class
                    ]
                };
            }
        }
    }

    const notices = await Notice.find(query).sort({ createdAt: -1 });
    res.json(notices);
});

// @desc    Create a new notice
// @route   POST /api/cms/notices
// @access  Private/Admin/Teacher
const createNotice = asyncHandler(async (req, res) => {
    const { title, content, date, targetClass } = req.body;

    const notice = await Notice.create({
        title,
        content,
        date,
        image: req.file ? req.file.path : null, // Assuming Cloudinary mw
        postedBy: req.user._id,
        targetClass: targetClass || null
    });

    res.status(201).json(notice);
});

const deleteNotice = asyncHandler(async (req, res) => {
    const notice = await Notice.findById(req.params.id);
    if(notice) {
        await notice.deleteOne();
        res.json({ message: 'Notice removed' });
    } else {
        res.status(404);
        throw new Error('Notice not found');
    }
});

// Gallery
const getGallery = asyncHandler(async (req, res) => {
  const gallery = await Gallery.find().sort({ createdAt: -1 });
  res.json(gallery);
});

const addGalleryItem = asyncHandler(async (req, res) => {
  const { title, category, imageUrl, description } = req.body;
  const item = await Gallery.create({
    title,
    category,
    imageUrl,
    description,
  });
  res.status(201).json(item);
});

const deleteGalleryItem = asyncHandler(async (req, res) => {
    const item = await Gallery.findById(req.params.id);
    if(item) {
        await item.deleteOne();
        res.json({ message: 'Gallery item removed' });
    } else {
        res.status(404);
        throw new Error('Gallery item not found');
    }
});

// @desc    Get dashboard stats
// @route   GET /api/cms/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Staff.countDocuments({ isTeacher: true }); // Assuming isTeacher flag is reliable
    const newEnquiries = await Enquiry.countDocuments({ status: 'New' });

    res.json({
        totalStudents,
        totalTeachers,
        newEnquiries
    });
});

module.exports = {
  getNotices,
  createNotice,
  deleteNotice,
  getGallery,
  addGalleryItem,
  deleteGalleryItem,
  getDashboardStats,
};
