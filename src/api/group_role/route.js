const {
    createDocumentType,
} = require("../document_type/controller");
const express = require("express");

const auth = require("../../middleware/auth_controller");
const {createGroup, getAllGroup, updateGroup, deleteGroup} = require("./controller");

const router = express.Router();

router.post("/create_group", auth, createGroup);
router.get("/get_groups", auth, getAllGroup);
router.post("/update_group", auth, updateGroup);
router.post("/delete_group", auth, deleteGroup);



module.exports = router;
