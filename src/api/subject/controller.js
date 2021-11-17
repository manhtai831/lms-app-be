const Subject = require("../../model/subject_model");
const userModel = require("../../model/user_model");
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
const {baseJsonPage} = require("../../utils/base_json");
const departmentModel = require("../../model/department_model");
const {uploadImage} = require("../../utils/image");

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

	var user = await userModel.findOne({id:req.user.id}).select("name");

	//set data
	const subjectModel = new Subject({
		name: req.body.name,
		description: req.body.description,
		idDepartment: req.body.idDepartment,
		status: req.body.status,
		createdAt: getNowFormatted(),
		createdBy: user,
	});

	//add data
	return subjectModel
		.save()
		.then((data) => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0
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
	var filter;
	if(req.query.idDepartment){
		filter = {idDepartment: req.query.idDepartment}
	}

	//find all subjects
	Subject.find(filter)
		.then(async (data) => {
			var datatmp = data;
			for(var i =0; i< datatmp.length; i++){
				var d = await departmentModel
					.findOne({id:datatmp[i].idDepartment})
				datatmp[i].department = d;
			}

			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					data:baseJsonPage(0,0,datatmp.length,datatmp)
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
	Subject.deleteOne({ id: req.body.id })
		.then(() => {
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
	var user = await userModel.findOne({id:req.user.id});
	//update subject
	Subject.updateOne(
		{ id: req.body.id },
		{
			$set: {
				name: req.body.name,
				description: req.body.description,
				status: req.body.status,
				idDepartment: req.body.idDepartment,
				updatedBy:user,
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
