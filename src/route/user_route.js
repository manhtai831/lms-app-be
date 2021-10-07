const {register,getUserInfo, login} = require('../controller/user_controller');
const auth = require("../middleware/auth_controller");
const express = require("express");
const userRouter = express.Router();


userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/info_user',auth, getUserInfo);

module.exports = userRouter;