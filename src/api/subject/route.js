const {
	createSubject,
	getAllSubjects,
	deleteSubject,
	updateSubject,
} = require("../subject/controller");
const express = require("express");
const auth = require("../../middleware/auth_controller");
const subjectRouter = express.Router();

subjectRouter.post("/subjects", auth, createSubject);
subjectRouter.get("/subjects", auth, getAllSubjects);
subjectRouter.delete("/subjects", auth, deleteSubject);
subjectRouter.put("/subjects", auth, updateSubject);

module.exports = subjectRouter;
