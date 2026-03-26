const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all enrollments (for admin)
// @route   GET /api/admin/enrollments
// @access  Private/Admin
router.get('/enrollments', auth, isAdmin, async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('user', 'name email role')
      .populate('course', 'title instructor duration totalModules')
      .sort('-enrolledAt');
    
    res.json(enrollments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all courses with enrollment stats
// @route   GET /api/admin/courses
// @access  Private/Admin
router.get('/courses', auth, isAdmin, async (req, res) => {
  try {
    const courses = await Course.find().sort('-createdAt');
    
    // Get enrollment count for each course
    const coursesWithStats = await Promise.all(courses.map(async (course) => {
      const enrollmentCount = await Enrollment.countDocuments({ course: course._id });
      return {
        ...course.toObject(),
        totalEnrollments: enrollmentCount
      };
    }));
    
    res.json(coursesWithStats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get enrollments for a specific user
// @route   GET /api/admin/users/:userId/enrollments
// @access  Private/Admin
router.get('/users/:userId/enrollments', auth, isAdmin, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.params.userId })
      .populate('course', 'title instructor duration totalModules')
      .sort('-enrolledAt');
    
    const user = await User.findById(req.params.userId).select('name email');
    
    res.json({
      user,
      enrollments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get dashboard stats for admin
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    const recentEnrollments = await Enrollment.find()
      .populate('user', 'name email')
      .populate('course', 'title')
      .sort('-enrolledAt')
      .limit(5);
    
    res.json({
      totalUsers,
      totalCourses,
      totalEnrollments,
      recentEnrollments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;