const express = require("express");

const auth = require("../../middleware/auth_controller");
const {registerClass, getRegisteredClass, cancelRegisteredClass} = require("./controller");

const router = express.Router();

router.post("/register_class", auth, registerClass);
router.get("/get_registered_class", auth, getRegisteredClass);
router.post("/cancel_registered_class", auth, cancelRegisteredClass);

module.exports = router;