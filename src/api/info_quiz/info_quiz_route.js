
const express = require("express");
const auth = require("../../middleware/auth_controller");
const {updateInfoQuiz, getInfoQuiz} = require("./info_quiz_controller");
const labRouter = express.Router();

labRouter.post("/update_info_quiz", auth, updateInfoQuiz);
labRouter.get("/get_info_quiz", auth, getInfoQuiz);
// labRouter.get("/get_all_labs", auth, getAllLabs);
// labRouter.get("/labs", auth, deleteLab);
// labRouter.post("/labs", auth, updatelab);

module.exports = labRouter;
