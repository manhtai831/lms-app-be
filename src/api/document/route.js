const {
	createDocument,
	getDocumentById,
	getAllDocuments,
	deleteDocument,
	updateDocument,
} = require("../document/controller");
const express = require("express");
const auth = require("../../middleware/auth_controller");
const documentRouter = express.Router();

documentRouter.post("/documents", auth, createDocument);
documentRouter.get("/documents", auth, getAllDocuments);
documentRouter.get("/document", auth, getDocumentById);
documentRouter.delete("/documents", auth, deleteDocument);
documentRouter.put("/documents", auth, updateDocument);

module.exports = documentRouter;
