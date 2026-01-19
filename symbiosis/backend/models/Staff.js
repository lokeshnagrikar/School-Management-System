const mongoose = require('mongoose');

const staffSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    position: {
      type: String, // e.g., "Principal", "Math Teacher", "Clerk"
      required: true,
    },
    bio: {
      type: String,
    },
    photoPath: {
      type: String, // URL
    },
    assignedSubjects: [
      {
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject',
        },
        class: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Class',
        },
      },
    ],
    // For specific role management if needed
    isTeacher: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
