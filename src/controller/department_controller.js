const { baseJson } = require("../utils/base_json");
const departmentModel = require("../model/department_model");
const params = require("params");

const createDepartment = async (req, res, next) => {
	const { name } = req.body;

	if (!name) {
		res.status(404).send("name is required");
	}

	const departmentExist = await departmentModel.findOne({ name: name });

	if (departmentExist) {
		return res
			.status(409)
			.json(baseJson({ code: 99, message: "ngành đã tồn tại" }));
	}

	const department = departmentModel({
		name: name,
	});

	await department
		.save()
		.then((data) => {
			res
				.status(200)
				.json(baseJson({ code: 0, message: "create success", data: data }));
		})
		.catch((error) => next(error));
};

const getDepartmentById = async (req, res, next) => {
	departmentModel
		.findOne({ id: req.query.id })
		.select("id name")
		.then((result) => {
			return res.status(200).json(baseJson({ code: 0, data: result }));
		})
		.catch((error) => {
			return res.status(500).json(baseJson({ code: 99, data: error }));
		})
		.catch((error) => next(error));
};

const getAllDepartment = async (req, res) => {
	departmentModel
		.find()
		.select("id name")
		.then((result) => {
			return res.status(200).json(baseJson({ code: 0, data: result }));
		})
		.catch((error) => {
			return res.status(500).json(baseJson({ code: 99, data: error }));
		})
		.catch((error) => next(error));
};

const deleteDepartment = async (req, res, next) => {
	departmentModel
		.deleteOne({ id: req.query.id })
		.then((result) => {
			return res.status(200).json(baseJson({ code: 0, data: result }));
		})
		.catch((error) => {
			return res.status(500).json(baseJson({ code: 99, data: error }));
		})
		.catch((error) => next(error));
};

const updateDepartment = async (req, res) => {
	departmentModel
		.updateOne({ id: req.body.id }, { $set: req.body })
		.then(() => {
			return res
				.status(200)
				.json(baseJson({ code: 0, data: "update cuccessfully" }));
		})
		.catch((err) => {
			return res.status(500).json(baseJson(99, err.message));
		});
};

module.exports = {
	createDepartment,
	getDepartmentById,
	deleteDepartment,
	getAllDepartment,
	updateDepartment,
};
