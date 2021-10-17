const express = require("express");

const auth = require("../../middleware/auth_controller");
const { addClassToSubject, getClassOfSubject, addAClassToASubject, deleteAClassInASubject} = require("./controller");


const router = express.Router();

router.post("/subject_class", auth, addClassToSubject);
router.get("/subject_class", auth, getClassOfSubject);
router.post("/a_subject_a_class", auth, addAClassToASubject);
router.delete("/a_subject_a_class", auth, deleteAClassInASubject);
// router.post("/cancel_registered_class", auth, cancelRegisteredClass);

module.exports = router;