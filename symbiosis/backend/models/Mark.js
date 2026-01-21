const mongoose = require('mongoose');

const markSchema = mongoose.Schema(
  {
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
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    examType: {
      type: String,
      required: true, // e.g. "Midterm", "Final", "Unit Test 1"
    },
    marksObtained: {
      type: Number,
      required: true,
    },
    maxMarks: {
      type: Number,
      required: true,
      default: 100,
    },
    remarks: {
      type: String,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
    }
  },
  {
    timestamps: true,
  }
);

// Unique index: One mark entry per student per subject per exam
markSchema.index({ student: 1, subject: 1, examType: 1 }, { unique: true });

const Mark = mongoose.model('Mark', markSchema);

module.exports = Mark;
