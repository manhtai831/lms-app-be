const {register,getUserInfo, login, deleteUser, updateUser} = require('../controller/user_controller');
const auth = require("../middleware/auth_controller");
const express = require("express");
const userRouter = express.Router();


userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/info_user',auth, getUserInfo);
userRouter.post('/delete_user',auth, deleteUser);
userRouter.post('/update_user',auth, updateUser);

module.exports = userRouter;