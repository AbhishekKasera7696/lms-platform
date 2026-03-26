const express = require('express');
const router = express.Router();
const { 
  getCourses, 
  getCourseById, 
  createCourse,
  deleteCourse 
} = require('../controllers/courseController');
const auth = require('../middleware/auth');

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', auth, createCourse);
router.delete('/:id', auth, deleteCourse); 

module.exports = router;