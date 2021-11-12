const express = require("express");

const auth = require("../../middleware/auth_controller");
const { getResposity} = require("./danh_muc_lon_controller");

const router = express.Router();
router.post("/create_class", auth, getResposity);
// router.get("/get_all_class", auth, getAllClass);
// router.post("/update_class", auth, updateClass);
// router.get("/delete_class", auth, deleteClass);

module.exports = router;
