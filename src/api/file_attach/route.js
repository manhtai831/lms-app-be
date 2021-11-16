const {
    createDocumentType,
} = require("../document_type/controller");
const express = require("express");

const auth = require("../../middleware/auth_controller");
const {createFileAttach, getListFileAttach, getListFileAttachByIdUser, getListFileAttachByIdDocument,
    getListFileAttachByIdTypeDocument, updateFileAttach, deleteFileAttach
} = require("./file_attach_controller");

const router = express.Router();

router.post("/create_file_attach", auth, createFileAttach);
router.get("/get_list_file_attach", auth, getListFileAttach);
router.get("/get_list_file_attach_by_user", auth, getListFileAttachByIdUser);
router.get("/get_list_file_attach_by_document", auth, getListFileAttachByIdDocument);
router.get("/get_list_file_attach_by_type_document", auth, getListFileAttachByIdTypeDocument);
router.post("/update_file_attach", auth, updateFileAttach);
router.get("/delete_file_attach", auth, deleteFileAttach);


module.exports = router;
