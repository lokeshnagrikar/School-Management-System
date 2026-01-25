const mongoose = require('mongoose');

const resultSchema = mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    subjects: [
        {
            subject: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Subject'
            },
            marksObtained: { type: Number, default: 0 },
            totalMarks: { type: Number, default: 100 },
            remarks: { type: String }
        }
    ],
    totalObtained: {
        type: Number,
        default: 0
    },
    totalMax: {
        type: Number,
        default: 0
    },
    percentage: {
        type: Number,
        default: 0
    },
    grade: {
        type: String // A+, A, B, etc.
    }
  },
  {
    timestamps: true,
  }
);

// Ensure one result per student per exam
resultSchema.index({ exam: 1, student: 1 }, { unique: true });

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;
