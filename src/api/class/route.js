const express = require("express");

const auth = require("../../middleware/auth_controller");
const {createClass, getAllClass, updateClass, deleteClass, getDetailClass} = require("./controller");

const router = express.Router();
router.post("/create_class", auth, createClass);
router.get("/get_all_class", auth, getAllClass);
router.get("/detail_class", auth, getDetailClass);
router.post("/update_class", auth, updateClass);
router.post("/delete_class", auth, deleteClass);

module.exports = router;
