const express = require("express");

const auth = require("../../middleware/auth_controller");
const { getResposity, createResposity, getRepository, deleteRepository, updateRepository} = require("./danh_muc_lon_controller");

const router = express.Router();
router.post("/create_repository", auth, createResposity);
router.get("/get_repository", auth, getRepository);
router.post("/update_repository", auth, updateRepository);
router.post("/delete_repository", auth, deleteRepository);

module.exports = router;
