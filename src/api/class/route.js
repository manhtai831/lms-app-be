const express = require("express");

const auth = require("../../middleware/auth_controller");
const {createClass, getAllClass} = require("./controller");

const router = express.Router();
router.post("/create_class", auth, createClass);
router.get("/get_all_class", auth, getAllClass);
// router.post("/update_department", auth, updateDepartment);
// router.post("/delete_department", auth, deleteDepartment);

module.exports = router;
