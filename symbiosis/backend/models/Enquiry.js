const mongoose = require('mongoose');

const enquirySchema = mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
    },
    parentName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    grade: { // Grade they are inquiring about
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Resolved', 'Closed'],
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

const Enquiry = mongoose.model('Enquiry', enquirySchema);

module.exports = Enquiry;
