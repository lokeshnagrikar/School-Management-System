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
      required: false, // Changed to false for initial Google Auth
    },
    section: {
      type: String,
      required: false, // Changed to false for initial Google Auth
    },
    parentName: {
      type: String,
      required: false, // Changed to false for Google Auth
    },
    phone: {
      type: String,
      required: false, // Changed to false for Google Auth
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
