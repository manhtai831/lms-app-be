const express = require("express");

const auth = require("../../middleware/auth_controller");
const {createSemester, getAllSemester, updateSemester, deleteSemester} = require("./controller");


const router = express.Router();

router.post("/create_semester", auth, createSemester);
router.get("/get_semester", auth, getAllSemester);
router.post("/update_semester", auth, updateSemester);
router.post("/delete_semester", auth, deleteSemester);

module.exports = router;