const express = require("express");

const auth = require("../../middleware/auth_controller");
const {createSemester, getAllSemester, updateSemester, deleteSemester} = require("./controller");


const router = express.Router();

router.post("/semester", auth, createSemester);
router.get("/semester", auth, getAllSemester);
router.put("/semester", auth, updateSemester);
router.delete("/semester", auth, deleteSemester);

module.exports = router;