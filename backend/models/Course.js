const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  instructor: {
    type: String,
    required: [true, 'Please add an instructor']
  },
  duration: {
    type: String,
    default: '4 weeks'
  },
  totalModules: {
    type: Number,
    default: 10
  },
  enrolledCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', CourseSchema);