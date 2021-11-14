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

assignmentRouter.post("/create_assigment", auth, createAssignment);
assignmentRouter.get("/assigment", auth, getDetailAssignmentById);
assignmentRouter.get("/get_all_assigments", auth, getAllAssignments);
assignmentRouter.get("/delete_assigments", auth, deleteAssignment);
assignmentRouter.post("/update_assigments", auth, updateAssignment);

module.exports = assignmentRouter;
