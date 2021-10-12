const Department = require("../../model/department_model");
const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const {
	getNowFormatted,
	verifyRole,
	convertDateTime,
} = require("../../utils/utils");
const userModel = require("../../model/user_model");
const departmentModel = require("../../model/department_model");
const {
	tao_nganh,
	danh_sach_nganh,
	cap_nhat_nganh,
	xoa_nganh,
} = require("../../utils/role_json");
const { baseJsonPage } = require("../../utils/base_json");

async function createDepartment(req, res) {
	var hasRole = await verifyRole(res, {
		roleId: tao_nganh.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}
	const user = await userModel
		.findOne({ id: req.user.id })
		.select("id name userName email  ");
	if (req.body.name == null) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Name department is required" })
			);
	}
	const departmentModel = new Department({
		name: req.body.description,
		description: req.body.description,
		createAt: getNowFormatted(),
		createBy: user,
	});

	return departmentModel
		.save()
		.then((newCourse) => {
			return res.status(status.success).json(baseJson.baseJson({ code: 0 }));
		})
		.catch((error) => {
			console.log(error);
			res.status(status.server_error).json(baseJson.baseJson({ code: 99 }));
		});
}

async function getAllDepartment(req, res) {
	var hasRole = await verifyRole(res, {
		roleId: danh_sach_nganh.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}
	const index = req.query.pageIndex || 1;
	const size = req.query.pageSize || 50;
	await departmentModel
		.find()
		.skip(Number(index) * Number(size) - Number(size))
		.limit(Number(size))
		.select("id name description createAt createBy updateAt updateBy")
		.exec((err, allDepartment) => {
			departmentModel.countDocuments((err1, count) => {
				if (err || Number(index) === 0)
					return res.status(status.server_error).json(
						baseJson.baseJson({
							code: 99,
							message: Number(index) === 0 ? "Error Index" : err.message,
						})
					);
				return res.status(status.success).json(
					baseJson.baseJson({
						code: 0,
						data: baseJsonPage(
							Number(index),
							Number(size),
							count,
							allDepartment
						),
					})
				);
			});
		});
}

async function updateDepartment(req, res) {
	var hasRole = await verifyRole(res, {
		roleId: cap_nhat_nganh.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}
	if (req.body.name == null) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Name department is required" })
			);
	}

	const user = await userModel
		.findOne({ id: req.user.id })
		.select("id name userName email  ");

	return departmentModel
		.updateOne(
			{ id: req.body.id },
			{
				$set: {
					updateAt: getNowFormatted(),
					updateBy: user,
					name: req.body.name,
					description: req.body.description,
				},
			}
		)
		.then(() => {
			return res.status(status.success).json(baseJson.baseJson({ code: 0 }));
		})
		.catch((error) => {
			console.log(error);
			res.status(status.server_error).json(baseJson.baseJson({ code: 99 }));
		});
}

async function deleteDepartment(req, res) {
	var hasRole = await verifyRole(res, {
		roleId: xoa_nganh.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}
	if (req.query.id == null) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Id department is required" })
			);
	}

	return departmentModel
		.deleteOne({ id: req.query.id })
		.then(() => {
			return res.status(status.success).json(baseJson.baseJson({ code: 0 }));
		})
		.catch((error) => {
			console.log(error);
			res.status(status.server_error).json(baseJson.baseJson({ code: 99 }));
		});
}

module.exports = {
	createDepartment,
	getAllDepartment,
	updateDepartment,
	deleteDepartment,
};
