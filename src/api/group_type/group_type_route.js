
const express = require("express");

const auth = require("../../middleware/auth_controller");
const {createGroupType, getAllGroupType, deleteGroupType, updateGroupType} = require("./group_type_controller");

const router = express.Router();

router.post("/create_group_type", auth, createGroupType);
router.get("/get_group_types", auth, getAllGroupType);
router.post("/update_group_type", auth, updateGroupType);
router.post("/delete_group_type", auth, deleteGroupType);



module.exports = router;
