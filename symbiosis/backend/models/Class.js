const mongoose = require('mongoose');

const classSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // e.g., "Grade 1"
    },
    sections: [
      {
        type: String, // e.g., "A", "B"
      },
    ],
    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff', // or 'User' if Staff model isn't always linked
      required: false,
    },
    // Optional: Link to subjects taught in this class
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
