const express = require('express');
const router = express.Router();
const { getMyEnrollments, enrollCourse } = require('../controllers/enrollmentController');
const auth = require('../middleware/auth');

router.get('/', auth, getMyEnrollments);
router.post('/:courseId', auth, enrollCourse);

module.exports = router;