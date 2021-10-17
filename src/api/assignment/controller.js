const Assignment = require("../../model/assignment_model");
const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const {
	getNowFormatted,
	verifyRole,
	convertDateTime,
} = require("../../utils/utils");
const {
	create_assignment,
	get_detail_assignment,
	get_all_assignments,
	update_assignment,
	delete_assignment,
} = require("../../utils/role_json");

const createAssignment = async (req, res, next) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: create_assignment.id,
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
	const assignmentModel = new Assignment({
		title: req.body.title,
		content: req.body.content,
		userId: req.body.userId,
		documentTypeId: req.body.documentTypeId,
		startTime: req.body.startTime,
		endTime: req.body.endTime,
		createdAt: getNowFormatted(),
		createdBy: req.user.id,
	});

	//add data
	return assignmentModel
		.save()
		.then((data) => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "create assignment finish!",
					data: data,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

const getDetailAssignmentById = async (req, res, next) => {
	//check roles
	var hasRole = await verifyRole(res, {
		roleId: get_detail_assignment.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}

	//find assignment by id
	Assignment.findOne({ id: req.query.id })
		.select(
			"id title content userId documentTypeId startTime endTime createdAt createdBy updatedAt updatedBy"
		)
		.then((data) => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "get detail assignment finish!",
					data: data,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

const getAllAssignments = async (req, res, next) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: get_all_assignments.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}

	// find all assignments
	Assignment.find()
		.select(
			"id title content userId documentTypeId startTime endTime createdAt createdBy updatedAt updatedBy"
		)
		.then((data) => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "get all assignments finish!",
					data: data,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

const deleteAssignment = async (req, res, next) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: delete_assignment.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}

	//delete assignment by id
	Assignment.deleteOne({ id: req.query.id })
		.then(() => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "delete assignment finish!",
					data: req.query.id,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

const updateAssignment = async (req, res) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: update_assignment.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}

	//update assignment
	Assignment.updateOne(
		//update by id
		{ id: req.query.id },
		//set and update data
		{
			$set: {
				userId: req.body.userId,
				title: req.body.title,
				content: req.body.content,
				documentTypeId: req.body.documentTypeId,
				startTime: req.body.startTime,
				endTime: req.body.endTime,
				updatedBy: req.user.id,
				updatedAt: getNowFormatted(),
			},
		}
	)
		.then(() => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "update assignment finish!",
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

module.exports = {
	createAssignment,
	getDetailAssignmentById,
	getAllAssignments,
	deleteAssignment,
	updateAssignment,
};
