const mongoose = require('mongoose');

const timetableSchema = mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    day: {
      type: String,
      required: true,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    periods: [
      {
        periodNumber: Number,
        startTime: String, // e.g., "09:00"
        endTime: String,   // e.g., "10:00"
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject',
        },
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);

// Composite unique index to ensure no duplicate timetable for same class/section/day
timetableSchema.index({ class: 1, section: 1, day: 1 }, { unique: true });

const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = Timetable;
