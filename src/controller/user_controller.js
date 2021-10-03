const express = require('express');
const mongoose = require('mongoose');
const Course =require ('../model/user_model');
const status = require('../utils/status');

// create new cause
module.exports.createCourse =  function (req, res) {
    const course = new Course({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
    });

    return course
        .save()
        .then((newCourse) => {
            return res.status(status.success).json({
                success: true,
                message: 'New cause created successfully',
                Course: newCourse,
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(status.server_error).json({
                success: false,
                message: 'Server error. Please try again.',
                error: error.message,
            });
        });
}