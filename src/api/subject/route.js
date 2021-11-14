const {
	createSubject,
	getAllSubjects,
	deleteSubject,
	updateSubject,
} = require("../subject/controller");
const express = require("express");
const auth = require("../../middleware/auth_controller");
const subjectRouter = express.Router();

subjectRouter.post("/create_subject", auth, createSubject);
subjectRouter.get("/get_subjects", auth, getAllSubjects);
subjectRouter.get("/subjects", auth, deleteSubject);
subjectRouter.post("/subjects", auth, updateSubject);

module.exports = subjectRouter;
