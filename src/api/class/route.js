const express = require("express");

const auth = require("../../middleware/auth_controller");
const {createClass, getAllClass, updateClass, deleteClass} = require("./controller");

const router = express.Router();
router.post("/create_class", auth, createClass);
router.get("/get_all_class", auth, getAllClass);
router.post("/update_class", auth, updateClass);
router.get("/delete_class", auth, deleteClass);

module.exports = router;
