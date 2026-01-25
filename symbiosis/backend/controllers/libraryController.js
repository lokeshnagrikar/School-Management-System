const asyncHandler = require('express-async-handler');
const Library = require('../models/Library');

// @desc    Get all books
// @route   GET /api/library
// @access  Private
const getBooks = asyncHandler(async (req, res) => {
    const books = await Library.find({});
    res.json(books);
});

// @desc    Add a new book
// @route   POST /api/library
// @access  Private (Admin/Librarian)
const addBook = asyncHandler(async (req, res) => {
    const book = await Library.create(req.body);
    res.status(201).json(book);
});

// @desc    Update book (issue/return logic simulated by count)
// @route   PUT /api/library/:id
// @access  Private (Admin/Librarian)
const updateBook = asyncHandler(async (req, res) => {
    const book = await Library.findById(req.params.id);

    if (book) {
        const updatedBook = await Library.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.json(updatedBook);
    } else {
        res.status(404);
        throw new Error('Book not found');
    }
});

// @desc    Delete book
// @route   DELETE /api/library/:id
// @access  Private (Admin only)
const deleteBook = asyncHandler(async (req, res) => {
    const book = await Library.findById(req.params.id);

    if (book) {
        await book.deleteOne();
        res.json({ message: 'Book removed' });
    } else {
        res.status(404);
        throw new Error('Book not found');
    }
});

module.exports = {
    getBooks,
    addBook,
    updateBook,
    deleteBook
};
