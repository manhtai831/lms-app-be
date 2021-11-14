const {
	createQuestion,
	getDetailQuestionById,
	getAllQuestions,
	deleteQuestion,
	updateQuestion,
} = require("./controller");
const express = require("express");
const auth = require("../../middleware/auth_controller");
const questionRouter = express.Router();

questionRouter.post("/create_questions", auth, createQuestion);
questionRouter.get("/question", auth, getDetailQuestionById);
questionRouter.get("/get_all_questions", auth, getAllQuestions);
questionRouter.get("/questions", auth, deleteQuestion);
questionRouter.post("/questions", auth, updateQuestion);

module.exports = questionRouter;
