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

labRouter.post("/labs", auth, createLab);
labRouter.get("/lab", auth, getDetailLabById);
labRouter.get("/labs", auth, getAllLabs);
labRouter.delete("/labs", auth, deleteLab);
labRouter.put("/labs", auth, updatelab);

module.exports = labRouter;
