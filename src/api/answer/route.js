const {
	createAnswer,
	getDetailAnswerById,
	getAllAnswers,
	deleteAnswer,
	updateAnswer,
} = require("./controller");
const express = require("express");
const auth = require("../../middleware/auth_controller");
const answerRouter = express.Router();

answerRouter.post("/answers", auth, createAnswer);
answerRouter.get("/answer", auth, getDetailAnswerById);
answerRouter.get("/answers", auth, getAllAnswers);
answerRouter.delete("/answers", auth, deleteAnswer);
answerRouter.put("/answers", auth, updateAnswer);

module.exports = answerRouter;
