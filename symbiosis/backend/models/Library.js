const mongoose = require('mongoose');

const librarySchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    totalCopies: {
        type: Number,
        required: true,
        default: 1
    },
    availableCopies: {
        type: Number,
        required: true,
        default: 1
    },
    status: {
        type: String,
        enum: ['Available', 'Out of Stock'],
        default: 'Available'
    },
    location: {
        type: String // e.g., "Shelf A-1"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Library', librarySchema);
