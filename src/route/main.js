const express = require('express');
const {createCourse, getAllCourse, getSingleCourse, deleteCourse} = require('../controller/test_controller');

const router = express.Router();
router.post('/courses', createCourse);
router.get('/courses', getAllCourse);
router.get('/detail-course', getSingleCourse);
router.post('/delete-course', deleteCourse);

module.exports = router;