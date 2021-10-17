const Lab = require("../../model/lab_model");
const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const {
	getNowFormatted,
	verifyRole,
	convertDateTime,
} = require("../../utils/utils");
const {
	create_lab,
	get_detail_lab,
	get_all_labs,
	update_lab,
	delete_lab,
} = require("../../utils/role_json");

const createLab = async (req, res, next) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: create_lab.id,
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
	const labModel = new Lab({
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
	return labModel
		.save()
		.then((data) => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "create lab finish!",
					data: data,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

const getDetailLabById = async (req, res, next) => {
	//check roles
	var hasRole = await verifyRole(res, {
		roleId: get_detail_lab.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}

	//find lab by id
	Lab.findOne({ id: req.query.id })
		.select(
			"id title content userId documentTypeId startTime endTime createdAt createdBy updatedAt updatedBy"
		)
		.then((data) => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "get detail lab finish!",
					data: data,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

const getAllLabs = async (req, res, next) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: get_all_labs.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}

	// find all labs
	Lab.find()
		.select(
			"id title content userId documentTypeId startTime endTime createdAt createdBy updatedAt updatedBy"
		)
		.then((data) => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "get all labs finish!",
					data: data,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

const deleteLab = async (req, res, next) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: delete_lab.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}

	//delete lab by id
	Lab.deleteOne({ id: req.query.id })
		.then(() => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "delete lab finish!",
					data: req.query.id,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

const updatelab = async (req, res) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: update_lab.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}

	//update lab
	Lab.updateOne(
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
					message: "update lab finish!",
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

module.exports = {
	createLab,
	getDetailLabById,
	getAllLabs,
	deleteLab,
	updatelab,
};
