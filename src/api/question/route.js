const {
	createQuestion,
	getDetailQuestionById,
	getAllQuestions,
	deleteQuestion,
	updateQuestion, getAllQuestionsQuick,
} = require("./controller");
const express = require("express");
const auth = require("../../middleware/auth_controller");
const questionRouter = express.Router();

questionRouter.post("/create_questions", auth, createQuestion);
questionRouter.get("/question", auth, getDetailQuestionById);
questionRouter.get("/getAllQuestionsQuick", auth, getAllQuestionsQuick);
questionRouter.get("/get_all_questions", auth, getAllQuestions);
questionRouter.post("/delete_questions", auth, deleteQuestion);
questionRouter.post("/update_questions", auth, updateQuestion);

module.exports = questionRouter;
