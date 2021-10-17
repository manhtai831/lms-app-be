const Subject = require("../../model/subject_model");
const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const {
	getNowFormatted,
	verifyRole,
	convertDateTime,
} = require("../../utils/utils");
const {
	create_subject,
	get_subjects,
	update_subject,
	delete_subject,
} = require("../../utils/role_json");

const createSubject = async (req, res, next) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: create_subject.id,
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
	const subjectModel = new Subject({
		name: req.body.name,
		description: req.body.description,
		createdAt: getNowFormatted(),
		createdBy: req.user.id,
	});

	//add data
	return subjectModel
		.save()
		.then((data) => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "create subject finish!",
					data: data,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

const getAllSubjects = async (req, res, next) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: get_subjects.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}

	//find all subjects
	Subject.find()
		.select("name description id")
		.then((data) => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "get subjects finish!",
					data: data,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

const deleteSubject = async (req, res, next) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: delete_subject.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}

	//delete subject by id
	Subject.deleteOne({ id: req.query.id })
		.then(() => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "delete subject finish!",
					data: req.query.id,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

//update subject status
const updateSubject = async (req, res) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: update_subject.id,
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
	Subject.updateOne(
		{ id: req.query.id },
		{
			$set: {
				name: req.body.name,
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
					message: "update subject finish!",
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

module.exports = {
	createSubject,
	getAllSubjects,
	deleteSubject,
	updateSubject,
};
