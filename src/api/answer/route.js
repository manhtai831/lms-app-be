const {
	createAnswer,
	getDetailAnswerById,
	getAllAnswers,
	deleteAnswer,
	updateAnswer,
} = require("./controller");
const express = require("express");
const auth = require("../../middleware/auth_controller");
const {updateStatusQuiz} = require("../quiz/quiz_controller");
const answerRouter = express.Router();

answerRouter.post("/create_answer", auth, createAnswer);
answerRouter.get("/answer", auth, getDetailAnswerById);
answerRouter.get("/get_all_answers", auth, getAllAnswers);
answerRouter.get("/answers", auth, deleteAnswer);
answerRouter.post("/answers", auth, updateAnswer);


module.exports = answerRouter;
