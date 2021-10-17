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

questionRouter.post("/questions", auth, createQuestion);
questionRouter.get("/question", auth, getDetailQuestionById);
questionRouter.get("/questions", auth, getAllQuestions);
questionRouter.delete("/questions", auth, deleteQuestion);
questionRouter.put("/questions", auth, updateQuestion);

module.exports = questionRouter;
