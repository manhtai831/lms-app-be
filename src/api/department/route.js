const express = require("express");
const {
	createDepartment,
	getAllDepartment,
	updateDepartment,
	deleteDepartment,
} = require("../../api/department/controller");
const auth = require("../../middleware/auth_controller");
const { tao_nganh } = require("../../utils/role_json");
const {getAllDepartments} = require("./controller");

const router = express.Router();
router.post("/create_department", auth, createDepartment);
router.get("/get_all_department", auth, getAllDepartment);
router.get("/get_all_departments", auth, getAllDepartments);
router.post("/update_department", auth, updateDepartment);
router.post("/delete_department", auth, deleteDepartment);

module.exports = router;
