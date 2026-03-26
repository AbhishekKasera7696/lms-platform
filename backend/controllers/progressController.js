const Progress = require('../models/Progress');
const Course = require('../models/Course');

// @desc    Get user's progress for a course
// @route   GET /api/progress/:courseId
// @access  Private
exports.getProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user.id,
      course: req.params.courseId
    });
    
    if (!progress) {
      return res.status(404).json({ message: 'No progress found for this course' });
    }
    
    const course = await Course.findById(req.params.courseId);
    const percentage = (progress.completedModules / course.totalModules) * 100;
    
    res.json({
      completedModules: progress.completedModules,
      totalModules: course.totalModules,
      percentage: Math.round(percentage)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update progress
// @route   PUT /api/progress/:courseId
// @access  Private
exports.updateProgress = async (req, res) => {
  try {
    const { completedModules } = req.body;
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    let progress = await Progress.findOne({
      user: req.user.id,
      course: req.params.courseId
    });
    
    if (!progress) {
      return res.status(404).json({ message: 'Not enrolled in this course' });
    }
    
    if (completedModules > course.totalModules) {
      return res.status(400).json({ message: 'Completed modules cannot exceed total modules' });
    }
    
    progress.completedModules = completedModules;
    progress.lastAccessed = Date.now();
    await progress.save();
    
    const percentage = (progress.completedModules / course.totalModules) * 100;
    
    res.json({
      completedModules: progress.completedModules,
      totalModules: course.totalModules,
      percentage: Math.round(percentage)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};