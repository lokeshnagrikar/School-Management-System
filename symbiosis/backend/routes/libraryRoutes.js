const express = require('express');
const router = express.Router();
const { getBooks, addBook, updateBook, deleteBook } = require('../controllers/libraryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getBooks)
    .post(protect, authorize('ADMIN'), addBook);

router.route('/:id')
    .put(protect, authorize('ADMIN'), updateBook)
    .delete(protect, authorize('ADMIN'), deleteBook);

module.exports = router;
