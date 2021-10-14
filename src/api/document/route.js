const {
	createDocument,
	getDocumentById,
	getAllDocuments,
	DeleteDocument,
	UpdateDocument,
} = require("../document/controller");
const express = require("express");
const auth = require("../../middleware/auth_controller");
const documentRouter = express.Router();

documentRouter.post("/documents", auth, createDocument);
documentRouter.get("/documents", auth, getAllDocuments);
documentRouter.get("/document", auth, getDocumentById);
documentRouter.delete("/documents", auth, DeleteDocument);
documentRouter.put("/documents", auth, UpdateDocument);

module.exports = documentRouter;
