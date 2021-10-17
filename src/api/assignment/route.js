const {
	createAssignment,
	getDetailAssignmentById,
	getAllAssignments,
	deleteAssignment,
	updateAssignment,
} = require("../assignment/controller");
const express = require("express");
const auth = require("../../middleware/auth_controller");
const assignmentRouter = express.Router();

assignmentRouter.post("/assigments", auth, createAssignment);
assignmentRouter.get("/assigment", auth, getDetailAssignmentById);
assignmentRouter.get("/assigments", auth, getAllAssignments);
assignmentRouter.delete("/assigments", auth, deleteAssignment);
assignmentRouter.put("/assigments", auth, updateAssignment);

module.exports = assignmentRouter;
