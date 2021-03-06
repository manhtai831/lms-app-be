const express = require("express");

const auth = require("../../middleware/auth_controller");
const {registerClass, getRegisteredClass, cancelRegisteredClass, getUserOfClass, checkRegisterClass,
    getSubjectRegisteredClass
} = require("./controller");

const router = express.Router();

router.post("/register_class", auth, registerClass);
router.get("/get_registered_class", auth, getRegisteredClass);
router.get("/get_subject_registered_class", auth, getSubjectRegisteredClass);
router.post("/check_registered_class", auth, checkRegisterClass);
router.get("/get_user_of_class", auth, getUserOfClass);
router.post("/cancel_registered_class", auth, cancelRegisteredClass);

module.exports = router;