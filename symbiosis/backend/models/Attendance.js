const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // or Staff
      required: true,
    },
    records: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student',
          required: true,
        },
        status: {
          type: String,
          enum: ['Present', 'Absent', 'Late', 'Excused'],
          default: 'Present',
        },
        remarks: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Ensure one record per class per day
attendanceSchema.index({ date: 1, class: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
