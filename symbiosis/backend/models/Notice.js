const mongoose = require('mongoose');

const noticeSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    image: {
      type: String, // URL
    },
    // Posted by User (Admin/Principal/Teacher)
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    targetClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      default: null, // null means public
    },
  },
  {
    timestamps: true,
  }
);

const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;
