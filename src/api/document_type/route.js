const {
	createDocumentType,
	getDepartmentTypes,
	DeleteDocumentType,
	UpdateDocumentType,
	getDocumentTypeById,
} = require("../document_type/controller");
const express = require("express");
const auth = require("../../middleware/auth_controller");
const documentTypeRouter = express.Router();

documentTypeRouter.post("/document_types", auth, createDocumentType);
documentTypeRouter.get("/document_type", auth, getDocumentTypeById);
documentTypeRouter.get("/document_types", auth, getDepartmentTypes);
documentTypeRouter.delete("/document_types", auth, DeleteDocumentType);
documentTypeRouter.put("/document_types", auth, UpdateDocumentType);

module.exports = documentTypeRouter;
