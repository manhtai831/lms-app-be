const express = require('express');
const {createCourse} = require('../controller/user_controller');

const router = express.Router();
router.post('/courses', createCourse);

module.exports = router;