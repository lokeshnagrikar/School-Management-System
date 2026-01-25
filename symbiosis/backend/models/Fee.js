const mongoose = require('mongoose');

const feeSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['Tuition', 'Transport', 'Library', 'Exam', 'Other'],
        default: 'Tuition'
    },
    status: {
        type: String,
        enum: ['Paid', 'Pending', 'Overdue'],
        default: 'Pending'
    },
    dueDate: {
        type: Date,
        required: true
    },
    paymentDate: {
        type: Date
    },
    transactionId: {
        type: String
    },
    academicYear: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Fee', feeSchema);
