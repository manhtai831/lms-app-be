const express = require('express');
const mongoose = require('mongoose');
const Course = require('../model/tetst_model');
const status = require('../utils/status');
const baseJson = require('../utils/base_json')
const {baseJsonPage} = require("../utils/base_json");

// create new cause
module.exports.createCourse = function (req, res) {
    const course = new Course({
        // _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
    });

    return course
        .save()
        .then((newCourse) => {
            return res.status(status.success).json(baseJson.baseJson(0, null));
        })
        .catch((error) => {
            console.log(error);
            res.status(status.server_error).json(baseJson.baseJson(99, error.message));
        });
}

// Get all course
module.exports.getAllCourse = function (req, res) {

    const index = req.query.pageIndex || 1;
    const size = req.query.pageSize;
    Course.find()
        .skip((Number(index) * Number(size)) - Number(size)) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
        .limit(Number(size))
        .select('id title description')
        .exec((err, allCourse) => {
            Course.countDocuments((err, count) => {
                if (err || Number(index) === 0) return res.status(status.server_error).json(baseJson.baseJson(99, Number(index) === 0 ? 'Error Index' : err.message));
                return res.status(status.success).json(baseJson.baseJson(0, baseJsonPage(Number(index), Number(size), count, allCourse)));
            })
        })

}

// get single course
module.exports.getSingleCourse = function (req, res) {
    const id = req.query.courseId;
    Course.findOne({id: id})
        .select('id title description')
        .then((singleCourse) => {
            res.status(200).json(baseJson.baseJson(0, singleCourse));
        })
        .catch((err) => {
            res.status(500).json(baseJson.baseJson(99, err.message));
        });
}
// delete a course
module.exports.deleteCourse =
    function (req, res) {
        const id = req.query.courseId;
        Course.findByIdAndRemove(id)
            .exec()
            .then(() => res.status(200).json(baseJson.baseJson(0, null)))
            .catch((err) => res.status(500).json(baseJson.baseJson(99, err.message)));
    }


// update course
module.exports.updateCourse = function (req, res) {
    const id = req.body._id;
    const updateObject = req.body;
    Course.updateOne({id: id}, {$set: updateObject})
        .exec()
        .then(() => {
            res.status(200).json({
                success: true,
                message: 'Course is updated',
                updateCourse: updateObject,
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: 'Server error. Please try again.'
            });
        });
}
