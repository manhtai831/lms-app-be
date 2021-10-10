const {register,getUserInfo, login, deleteUser, updateUser, changePassword} = require('../../controller/tai_khoan/user_controller');
const auth = require("../../middleware/auth_controller");
const express = require("express");
const {addRoleToAccount, addRole, updateRole, getAllRole, deleteRole} = require("../../controller/quyen/user_role_controller");
const userRouter = express.Router();


userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/info_user',auth, getUserInfo);
userRouter.post('/delete_user',auth, deleteUser);
userRouter.post('/update_user',auth, updateUser);
userRouter.post('/change_password',auth, changePassword);
userRouter.post('/add_role_to_user',auth, addRoleToAccount);

userRouter.post('/add_role',auth, addRole);
userRouter.get('/get_all_role',auth, getAllRole);
userRouter.post('/update_role',auth, updateRole);
userRouter.get('/delete_role',auth, deleteRole);

module.exports = userRouter;