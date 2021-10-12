const express = require("express");
const {
	createDepartment,
	getAllDepartment,
	updateDepartment,
	deleteDepartment,
} = require("../../api/department/controller");
const auth = require("../../middleware/auth_controller");
const { tao_nganh } = require("../../utils/role_json");

const router = express.Router();
router.post("/create", auth, createDepartment);
router.get("/get_all_department", auth, getAllDepartment);
router.post("/update_department", auth, updateDepartment);
router.post("/delete_department", auth, deleteDepartment);

module.exports = router;
