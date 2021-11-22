const express = require("express");

const auth = require("../../middleware/auth_controller");
const { addClassToSubject, getClassOfSubject, addAClassToASubject, deleteAClassInASubject, getQuestionByDanhMuc} = require("./quiz_doc_controller");


const router = express.Router();

router.get("/list_question_by_type", auth, getQuestionByDanhMuc);
// router.get("/subject_class", auth, getClassOfSubject);
// router.post("/a_subject_a_class", auth, addAClassToASubject);
// router.delete("/a_subject_a_class", auth, deleteAClassInASubject);
// router.post("/cancel_registered_class", auth, cancelRegisteredClass);

module.exports = router;