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
const {getListUser, resetPassword, getImage, showImage} = require("./controller");
const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/list_user", getListUser);
userRouter.get("/info_user", auth, getUserInfo);
userRouter.post("/delete_user", auth, deleteUser);
userRouter.post("/update_user", auth, updateUser);
userRouter.post("/change_password", auth, changePassword);
userRouter.post("/reset_password", auth, resetPassword);
userRouter.post("/add_role_to_user", auth, addRoleToAccount);
// userRouter.post("/image", getImage);
userRouter.get("/upload", showImage);
// userRouter.get("/image", getImage);

userRouter.post("/add_role", addRole);
userRouter.post("/get_all_role", auth, getAllRole);
userRouter.post("/update_role", auth, updateRole);
userRouter.get("/delete_role", auth, deleteRole);

module.exports = userRouter;
