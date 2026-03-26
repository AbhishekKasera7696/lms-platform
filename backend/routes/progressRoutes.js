const express = require('express');
const router = express.Router();
const { getProgress, updateProgress } = require('../controllers/progressController');
const auth = require('../middleware/auth');

router.get('/:courseId', auth, getProgress);
router.put('/:courseId', auth, updateProgress);

module.exports = router;