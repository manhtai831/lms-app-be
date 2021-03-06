
const express = require("express");
const auth = require("../../middleware/auth_controller");
const {updateInfoQuiz, getInfoQuiz, updatePointInfoQuiz, getInfoMoreQuiz} = require("./info_quiz_controller");
const labRouter = express.Router();

labRouter.post("/update_info_quiz", auth, updateInfoQuiz);
labRouter.get("/get_info_quiz", auth, getInfoQuiz);
labRouter.get("/get_info_more_quiz", auth, getInfoMoreQuiz);
labRouter.post("/update_point_info_quiz", auth, updatePointInfoQuiz);
// labRouter.get("/labs", auth, deleteLab);
// labRouter.post("/labs", auth, updatelab);

module.exports = labRouter;
