const express = require("express");

const auth = require("../../middleware/auth_controller");
const {addSemesterToUser, getSemesterOfUser} = require("./controller");


const router = express.Router();

router.post("/user_semester", auth, addSemesterToUser);
router.get("/user_semester", auth, getSemesterOfUser);
// router.post("/cancel_registered_class", auth, cancelRegisteredClass);

module.exports = router;