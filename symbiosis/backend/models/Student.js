const mongoose = require('mongoose');

const studentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Link to login credentials
    },
    name: { // Duplicated from User for easier querying or if different
      type: String,
      required: true,
    },
    admissionNumber: {
      type: String,
      unique: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    parentName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: { // Optional contact email different from login
      type: String,
    },
    profileImage: {
      type: String, // URL from Cloudinary
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Graduated'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
