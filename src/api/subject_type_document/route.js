const express = require("express");

const auth = require("../../middleware/auth_controller");
const {addATDocumentToASubject, getTypeDocumentOfSubject, getAllTypeDocument} = require("./controller");


const router = express.Router();

router.get("/get_all_type_document", getAllTypeDocument);
router.post("/subject_type_document", auth, addATDocumentToASubject);
router.get("/subject_type_document", auth, getTypeDocumentOfSubject);
// router.post("/a_subject_a_class", auth, addAClassToASubject);
// router.delete("/a_subject_a_class", auth, deleteAClassInASubject);
// router.post("/cancel_registered_class", auth, cancelRegisteredClass);

module.exports = router;