const express = require("express");

const auth = require("../../middleware/auth_controller");
const { getResposity, createResposity, getRepository} = require("./danh_muc_lon_controller");

const router = express.Router();
router.post("/create_repository", auth, createResposity);
router.get("/get_repository", auth, getRepository);
// router.post("/update_class", auth, updateClass);
// router.get("/delete_class", auth, deleteClass);

module.exports = router;
