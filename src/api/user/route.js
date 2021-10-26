const {
	register,
	getUserInfo,
	login,
	deleteUser,
	updateUser,
	changePassword,
} = require("../../api/user/controller");
const auth = require("../../middleware/auth_controller");
const express = require("express");
const {
	addRoleToAccount,
	addRole,
	updateRole,
	getAllRole,
	deleteRole,
} = require("../../api/user_role/controller");
const {getListUser} = require("./controller");
const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/list_user", getListUser);
userRouter.get("/info_user", auth, getUserInfo);
userRouter.post("/delete_user", auth, deleteUser);
userRouter.post("/update_user", auth, updateUser);
userRouter.post("/change_password", auth, changePassword);
userRouter.post("/add_role_to_user", auth, addRoleToAccount);

userRouter.post("/add_role", addRole);
userRouter.get("/get_all_role", auth, getAllRole);
userRouter.post("/update_role", auth, updateRole);
userRouter.get("/delete_role", auth, deleteRole);

module.exports = userRouter;
