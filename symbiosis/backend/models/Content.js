const mongoose = require('mongoose');

const contentSchema = mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      unique: true, // e.g. 'home-hero', 'about-mission'
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
        type: String
    },
    body: {
        type: String
    },
    imageUrl: {
        type: String
    }
  },
  {
    timestamps: true,
  }
);

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
