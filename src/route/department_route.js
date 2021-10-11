const {
	createDepartment,
	getDepartmentById,
	deleteDepartment,
	getAllDepartment,
	updateDepartment,
} = require("../controller/department_controller");
const express = require("express");
const departmentRouter = express.Router();

departmentRouter.post("/department", createDepartment);
departmentRouter.get("/department", getDepartmentById);
departmentRouter.delete("/departments", deleteDepartment);
departmentRouter.get("/departments", getAllDepartment);
departmentRouter.put("/department", updateDepartment);

module.exports = departmentRouter;
