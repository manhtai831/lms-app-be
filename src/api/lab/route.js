const {
	createLab,
	getDetailLabById,
	getAllLabs,
	deleteLab,
	updatelab,
} = require("./controller");
const express = require("express");
const auth = require("../../middleware/auth_controller");
const labRouter = express.Router();

labRouter.post("/create_lab", auth, createLab);
labRouter.get("/lab", auth, getDetailLabById);
labRouter.get("/get_all_labs", auth, getAllLabs);
labRouter.get("/labs", auth, deleteLab);
labRouter.post("/labs", auth, updatelab);

module.exports = labRouter;
