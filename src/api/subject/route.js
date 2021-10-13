const {
	createSubject,
	getAllSubjects,
	deleteSubject,
	updateSubject,
} = require("../subject/controller");
const express = require("express");
const auth = require("../../middleware/auth_controller");
const subjectRouter = express.Router();

subjectRouter.post("/subject", auth, createSubject);
subjectRouter.get("/subjects", auth, getAllSubjects);
subjectRouter.delete("/subject", auth, deleteSubject);
subjectRouter.put("/subject", auth, updateSubject);

module.exports = subjectRouter;
