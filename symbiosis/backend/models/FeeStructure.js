const mongoose = require('mongoose');

const feeStructureSchema = mongoose.Schema({
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    type: {
        type: String, // e.g., "Tuition", "Library", "Annual"
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    academicYear: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

// Prevent duplicate fee structures for same class and type in same year
feeStructureSchema.index({ class: 1, type: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('FeeStructure', feeStructureSchema);
