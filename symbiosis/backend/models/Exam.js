const mongoose = require('mongoose');

const examSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // e.g., "Mid-Term Examination 2024"
    },
    academicYear: {
      type: String,
      required: true, // e.g., "2023-2024"
    },
    term: {
        type: String,
        enum: ['Term 1', 'Term 2', 'Final'], // Customize as needed
        required: true
    },
    classes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
      },
    ],
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;
