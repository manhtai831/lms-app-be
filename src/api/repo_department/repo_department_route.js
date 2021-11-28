const express = require("express");

const auth = require("../../middleware/auth_controller");
const { getResposity, createResposity, getRepository, deleteRepository, updateRepository, createRespoDepartment,
    getRepoDepartment, updateRepoDepartment, deleteRepoDepartment
} = require("./repo_department_controller");

const router = express.Router();
router.post("/create_repo_department", auth, createRespoDepartment);
router.get("/get_repo_department", auth, getRepoDepartment);
router.post("/update_repo_department", auth, updateRepoDepartment);
router.post("/delete_repo_department", auth, deleteRepoDepartment);

module.exports = router;
