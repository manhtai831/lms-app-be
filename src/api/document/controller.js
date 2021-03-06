const Document = require("../../model/document_model");
const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const {
	getNowFormatted,
	verifyRole,
	convertDateTime,
} = require("../../utils/utils");
const {
	create_document,
	get_detail_document,
	get_all_documents,
	update_document,
	delete_document,
} = require("../../utils/role_json");

const createDocument = async (req, res, next) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: create_document.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}

	//set data
	const DocumentModel = new Document({
		title: req.body.title,
		content: req.body.content,
		description: req.body.description,
		createdAt: getNowFormatted(),
		createdBy: req.user.id,
	});

	//add data
	return DocumentModel.save()
		.then((data) => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "create document finish!",
					data: data,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

const getDocumentById = async (req, res, next) => {
	//check roles
	var hasRole = await verifyRole(res, {
		roleId: get_detail_document.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}

	//find document by id
	Document.findOne({ id: req.query.id })
		.select(
			"id title content description createdAt createdBy updatedAt updatedBy"
		)
		.then((data) => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "get detail document finish!",
					data: data,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

const getAllDocuments = async (req, res, next) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: get_all_documents.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}

	// find all document types
	Document.find()
		.select(
			"id title content description createdAt createdBy updatedAt updatedBy"
		)
		.then((data) => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "get all documents finish!",
					data: data,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

const deleteDocument = async (req, res, next) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: delete_document.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}

	//delete document by id
	Document.deleteOne({ id: req.query.id })
		.then(() => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "delete document finish!",
					data: req.query.id,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

const updateDocument = async (req, res) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: update_document.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}

	//update subject
	Document.updateOne(
		{ id: req.query.id },
		{
			$set: {
				title: req.body.title,
				content: req.body.content,
				description: req.body.description,
				updatedBy: req.user.id,
				updatedAt: getNowFormatted(),
			},
		}
	)
		.then(() => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "update document finish!",
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

module.exports = {
	createDocument,
	getDocumentById,
	getAllDocuments,
	deleteDocument,
	updateDocument,
};
