const asyncHandler = require('express-async-handler');
const Notice = require('../models/Notice');
const Gallery = require('../models/Gallery');

// Notices
const getNotices = asyncHandler(async (req, res) => {
  const notices = await Notice.find().sort({ createdAt: -1 });
  res.json(notices);
});

const createNotice = asyncHandler(async (req, res) => {
  const { title, content, image } = req.body;
  const notice = await Notice.create({
    title,
    content,
    image,
    postedBy: req.user._id,
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

module.exports = {
  getNotices,
  createNotice,
  deleteNotice,
  getGallery,
  addGalleryItem,
  deleteGalleryItem,
};
