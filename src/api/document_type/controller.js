const DocumentType = require("../../model/document_type_model");
const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const {
	getNowFormatted,
	verifyRole,
	convertDateTime,
} = require("../../utils/utils");
const {
	create_document_type,
	get_document_type,
	update_document_type,
	delete_document_type,
	get_detail_document_type,
} = require("../../utils/role_json");

const createDocumentType = async (req, res, next) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: create_document_type.id,
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
	const DocumentTypeModel = new DocumentType({
		name: req.body.name,
		createdAt: getNowFormatted(),
		createdBy: req.user.id,
	});

	//add data
	return DocumentTypeModel.save()
		.then((data) => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "create document type finish!",
					data: data,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

const getDocumentTypeById = async (req, res, next) => {
	//check roles
	var hasRole = await verifyRole(res, {
		roleId: get_detail_document_type.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}

	//find document type by id
	DocumentType.findOne({ id: req.query.id })
		.select("id name")
		.then((data) => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "get detail document type finish!",
					data: data,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

const getDepartmentTypes = async (req, res, next) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: get_document_type.id,
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
	DocumentType.find()
		.select("id name")
		.then((data) => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "get document types finish!",
					data: data,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

const DeleteDocumentType = async (req, res, next) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: delete_document_type.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}

	//delete document type by id
	DocumentType.deleteOne({ id: req.query.id })
		.then(() => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "delete document type finish!",
					data: req.query.id,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

const UpdateDocumentType = async (req, res) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: update_document_type.id,
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
	DocumentType.updateOne(
		{ id: req.query.id },
		{
			$set: {
				name: req.body.name,
				updatedBy: req.user.id,
				updatedAt: getNowFormatted(),
			},
		}
	)
		.then(() => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "update document type finish!",
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

module.exports = {
	createDocumentType,
	getDepartmentTypes,
	DeleteDocumentType,
	UpdateDocumentType,
	getDocumentTypeById,
};
