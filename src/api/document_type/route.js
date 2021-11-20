const {
    createDocumentType,
    getDepartmentTypes,
    DeleteDocumentType,
    UpdateDocumentType,
    getDocumentTypeById,
} = require("../document_type/controller");
const express = require("express");
const auth = require("../../middleware/auth_controller");
const {getDocumentTypeByClassOrSubject, getDocumentTypes, getDetailDocumentType} = require("./controller");
const documentTypeRouter = express.Router();

documentTypeRouter.post("/create_document_type", auth, createDocumentType);
// documentTypeRouter.get("/document_type", auth, getDocumentTypeById);
// documentTypeRouter.get("/sub_document_type", auth, getDocumentTypeByClassOrSubject);
documentTypeRouter.get("/get_document_types", auth, getDocumentTypes);
documentTypeRouter.get("/detail_document_types", auth, getDetailDocumentType);
documentTypeRouter.post("/delete_document_types", auth, DeleteDocumentType);
documentTypeRouter.post("/update_document_types", auth, UpdateDocumentType);

module.exports = documentTypeRouter;
