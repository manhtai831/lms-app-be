const Answer = require("../../model/answer_model");
const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const {
	getNowFormatted,
	verifyRole,
	convertDateTime,
} = require("../../utils/utils");
const {
	create_answer,
	get_detail_answer,
	get_all_answers,
	update_answer,
	delete_answer,
} = require("../../utils/role_json");

const createAnswer = async (req, res, next) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: create_answer.id,
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
	const answerModel = new Answer({
		content: req.body.content,
		idCauHoi:req.body.idCauHoi,
		createdAt: getNowFormatted(),
		createdBy: req.user.id,
	});

	//add data
	return answerModel
		.save()
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
};

const getDetailAnswerById = async (req, res, next) => {
	//check roles
	var hasRole = await verifyRole(res, {
		roleId: get_detail_answer.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}

	//find answer by id
	Answer.findOne({ id: req.query.id })
		.select("id content createdAt createdBy updatedAt updatedBy")
		.then((data) => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "get detail answer finish!",
					data: data,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

const getAllAnswers = async (req, res, next) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: get_all_answers.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}

	// find all answers
	Answer.find()
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
};

const deleteAnswer = async (req, res, next) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: delete_answer.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}

	//delete answer by id
	Answer.deleteOne({ id: req.query.id })
		.then(() => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "delete answer finish!",
					data: req.query.id,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

const updateAnswer = async (req, res) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: update_answer.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}

	//update answer
	Answer.updateOne(
		//update by id
		{ id: req.query.id },
		//set and update data
		{
			$set: {
				content: req.body.content,
				updatedBy: req.user.id,
				updatedAt: getNowFormatted(),
			},
		}
	)
		.then(() => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "update answer finish!",
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

module.exports = {
	createAnswer,
	getDetailAnswerById,
	getAllAnswers,
	deleteAnswer,
	updateAnswer,
};
