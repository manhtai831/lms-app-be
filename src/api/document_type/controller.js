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
	get_detail_document_type, get_document_type_in_subject_class,
} = require("../../utils/role_json");
const {baseJsonPage} = require("../../utils/base_json");

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

	if(req.body.type === 'FILE'){
		if(req.body.link == null){
			return res
				.status(status.success)
				.json(
					baseJson.baseJson({ code: 99, message: "\"link\" is required" })
				);
		}
	}else if(req.body.type === 'FOLDER'  || req.body.type === 'QUIZ'|| req.body.type === 'LAB' || req.body.type === 'ASSIGNMENT'){

	}else
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "\"type\" is unavailable" })
			);

	//set data
	const DocumentTypeModel = new DocumentType({
		name: req.body.name,
		idClass: req.body.idClass,
		idSubject: req.body.idSubject,
		type:req.body.type,
		link:req.body.link,
		createdAt: getNowFormatted(),
		createdBy: req.user.id,
	});

	//add data
	return DocumentTypeModel.save()
		.then((data) => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
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

const getDocumentTypeByClassOrSubject = async (req, res, next) => {
	//check roles
	var hasRole = await verifyRole(res, {
		roleId: get_document_type_in_subject_class.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}
if(req.query.isSubject === 'TRUE'){
	//find document type by id
	DocumentType.find({ idSubject: req.query.id })
		.select("id name idSubject idClass")
		.then((data) => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					data: data,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
}else{
	//find document type by id
	DocumentType.find({ idClass: req.query.id })
		.select("id name idSubject idClass")
		.then((data) => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					data: data,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
}

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
	var filter;
	if(req.query.idSubject && req.query.idClass){
		filter = {
			idSubject:req.query.idSubject,
			idClass: req.query.idClass
		}
	}
	else if(req.query.idSubject){
		filter = {
			idSubject:req.query.idSubject
		}
	}
	else if(req.query.idClass){
		filter = {
			idClass:req.query.idClass
		}
	}

	// find all document types
	DocumentType.find(filter)
		.then((data) => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					data: baseJsonPage(0,0,data.length,data),
				})
			);
		})
		.catch((error) => {
			next(error);
			return res.status(400).json(baseJson.baseJson({
				code: 99,data:error
			}))
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
	getDocumentTypeById,getDocumentTypeByClassOrSubject
};
