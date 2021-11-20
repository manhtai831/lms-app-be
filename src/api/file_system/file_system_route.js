
const express = require("express");

const auth = require("../../middleware/auth_controller");
const {createFileSystem, getAllFileSystem, updateFileSystem, deleteFileSystem} = require("./file_system_controller");


const router = express.Router();

router.post("/create_file_system", auth, createFileSystem);
router.get("/get_file_system", auth, getAllFileSystem);
router.post("/update_file_system", auth, updateFileSystem);
router.post("/delete_file_system", auth, deleteFileSystem);



module.exports = router;
