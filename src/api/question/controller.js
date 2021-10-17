const Question = require("../../model/question_model");
const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const {
	getNowFormatted,
	verifyRole,
	convertDateTime,
} = require("../../utils/utils");
const {
	create_question,
	get_detail_question,
	get_all_questions,
	update_question,
	delete_question,
} = require("../../utils/role_json");

const createQuestion = async (req, res, next) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: create_question.id,
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
	const questionModel = new Question({
		content: req.body.content,
		createdAt: getNowFormatted(),
		createdBy: req.user.id,
	});

	//add data
	return questionModel
		.save()
		.then((data) => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "create question finish!",
					data: data,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

const getDetailQuestionById = async (req, res, next) => {
	//check roles
	var hasRole = await verifyRole(res, {
		roleId: get_detail_question.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}

	//find question by id
	Question.findOne({ id: req.query.id })
		.select("id content createdAt createdBy updatedAt updatedBy")
		.then((data) => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "get detail question finish!",
					data: data,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

const getAllQuestions = async (req, res, next) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: get_all_questions.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}

	// find all questions
	Question.find()
		.select("id content createdAt createdBy updatedAt updatedBy")
		.then((data) => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "get all question finish!",
					data: data,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

const deleteQuestion = async (req, res, next) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: delete_question.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}

	//delete question by id
	Question.deleteOne({ id: req.query.id })
		.then(() => {
			return res.status(status.success).json(
				baseJson.baseJson({
					code: 0,
					message: "delete question finish!",
					data: req.query.id,
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

const updateQuestion = async (req, res) => {
	//check role
	var hasRole = await verifyRole(res, {
		roleId: update_question.id,
		userId: req.user.id,
	});
	if (hasRole === false) {
		return res
			.status(status.success)
			.json(
				baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
			);
	}

	//update question
	Question.updateOne(
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
					message: "update question finish!",
				})
			);
		})
		.catch((error) => {
			next(error);
		});
};

module.exports = {
	createQuestion,
	getDetailQuestionById,
	getAllQuestions,
	deleteQuestion,
	updateQuestion,
};
