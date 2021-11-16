const {
    createQuiz, getAllQuiz, updateStatusQuiz,
} = require("./quiz_controller");
const express = require("express");
const auth = require("../../middleware/auth_controller");
const questionRouter = express.Router();

questionRouter.post("/create_quiz", auth, createQuiz);
// questionRouter.get("/question", auth, getDetailQuestionById);
questionRouter.get("/get_all_quiz", auth, getAllQuiz);
// questionRouter.get("/questions", auth, deleteQuestion);
// questionRouter.post("/questions", auth, updateQuestion);
questionRouter.get("/update_status_quiz", auth, updateStatusQuiz);

module.exports = questionRouter;
