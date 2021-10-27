// noinspection ES6MissingAwait

const jwt = require("jsonwebtoken");
const userModel = require("../../model/user_model");
const userRoleModel = require("../../model/user_role_model");
const roleModel = require("../../model/role_model");
const bcrypt = require("bcrypt");
const { baseJson } = require("../../utils/base_json");
const UserRoleModel = require("../../model/user_role_model");

async function register(req, res) {
	let encryptedPassword;
	try {
		const { userName, password} = req.body;

		if (!(password && userName)) {
			return res
				.status(200)
				.json(baseJson({ code: 99, message: "Yêu cầu tài khoản và mật khẩu" }));
		}

		const oldUser = await userModel.findOne({ userName: userName });

		if (oldUser) {
			return res
				.status(200)
				.json(baseJson({ code: 99, message: "Tài khoản đã tồn tại" }));
		}

		// encryptedPassword = await bcrypt.hash(password, 10);

		var listRoleDefault = [2,3,10,14,20,200,22,25,26,27,30,32,34,38,41,42,43,44,201,202,203,206,207,208,];

		const user = userModel({
			name:null,
			birth:null,
			avatar: null,
			phoneNumber: null,
			permission:listRoleDefault,
			userName: userName,
			email: userName, // sanitize: convert email to lowercase
			password: password,
		});

		const token = jwt.sign(
			{ user_id: user._id },
			process.env.ACCESS_TOKEN_SECRET,
			{
				expiresIn: process.env.ACCESS_TOKEN_LIFE,
			}
		);

		user.token = token;
		await user.save().then(async (data)=>{
			for(var i = 0; i< listRoleDefault.length; i++){
				const userRoleModel = new UserRoleModel({
					idUser: data.id,
					idRole: listRoleDefault[i],
				});
				await userRoleModel.save();
			}
			res.status(200).json(
				baseJson({
					code: 0,
					message: "Success",
				})
			);
		});

	} catch (err) {
		console.log(err);
		res.status(500).json(baseJson({ code: 99, data: err }));
	}
}

async function login(req, res) {
	try {
		// Get user input
		const { userName, password } = req.body;

		// Validate user input
		if (!(userName && password)) {
			res.status(400).send("All input is required");
		}

		// Validate if user exist in our database
		const user = await userModel
			.findOne({ userName: userName, password: password})
			.select("id permission name userName email token birth phoneNumber avatar");
		if (user) {
			// Create token
			const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
				expiresIn: process.env.ACCESS_TOKEN_LIFE,
			});
			user.token = token;

			var roles = await userRoleModel
				.find({ idUser: user.id })
				.select("idRole name");
			// for (var i = 0; i < roles.length; i++) {
			// 	var role =await roleModel
			// 		.findOne({ id: roles[i].idRole });
			// 	console.log(role.name);
			// 	roles[i].name = role.name;
			// }
			user.permission = roles;

			return res.status(200).json(baseJson({ code: 0, data: user }));
		}
		return res
			.status(200)
			.json(baseJson({ code: 99, message: "Sai tài khoản hoặc mật khẩu" }));
	} catch (err) {
		console.log(err);
		return res.status(200).json(baseJson({ code: 99, data: err }));
	}
	// Our register logic ends here
}

async function getUserInfo(req, res) {
	try {
		console.log(req.user);
		var user = await userModel
			.findOne({ id: req.user.id })
			.select("id permission name userName email token birth phoneNumber avatar");
		if (user) {
			const roles = await userRoleModel
				.find({ idUser: user.id })
				.select("idRole name");
			// for (var i = 0; i < roles.length; i++) {
			// 	const role = await roleModel
			// 		.findOne({ id: roles[i].idRole })
			// 		.select("id name");
			// 	roles[i].name = role.name;
			// }
			user.permission = roles;

			return res.status(200).json(baseJson({ code: 0, data: user }));
		}
		return res
			.status(200)
			.json(baseJson({ code: 99, message: "Tài khoản chưa được đăng ký" }));
	} catch (error) {
		return res.status(500).json(baseJson({ code: 99, data: error }));
	}
}

async function getListUser(req, res) {
	try {
		console.log(req.user);
		var users = await userModel
			.find()
			.select("id name userName email avatar");
		if (users) {

			return res.status(200).json(baseJson({ code: 0, data: users }));
		}
		return res
			.status(200)
			.json(baseJson({ code: 99, message: "Tài khoản chưa được đăng ký" }));
	} catch (error) {
		return res.status(500).json(baseJson({ code: 99, data: error }));
	}
}

async function deleteUser(req, res) {
	console.log(req.user);
	userModel
		.deleteOne({ id: req.user.id })
		.then((result) => {
			return res.status(200).json(baseJson({ code: 0, data: {} }));
		})
		.catch((error) => {
			return res.status(500).json(baseJson({ code: 99, data: error }));
		});
}

async function updateUser(req, res) {
	console.log(req.body);
	userModel
		.updateOne({ id: req.user.id }, { $set: req.body })
		.then((result) => {
			return res.status(200).json(baseJson({ code: 0, data: {} }));
		})
		.catch((error) => {
			return res.status(500).json(baseJson({ code: 99, data: error }));
		});
}

async function changePassword(req, res) {
	console.log(req.user);
	var user = await userModel.findOne({ id: req.user.id });
	if (user != null) {
		if (req.body.oldPassword === user.password) {
			userModel
				.updateOne(
					{ id: req.user.id },
					{ $set: { password: req.body.newPassword } }
				)
				.then((result) => {
					return res.status(200).json(baseJson({ code: 0 }));
				})
				.catch((error) => {
					return res.status(500).json(baseJson({ code: 99, data: error }));
				});
		} else {
			return res
				.status(200)
				.json(baseJson({ code: 0, message: "Sai mật khẩu cũ" }));
		}
	}
}

module.exports = {
	register,
	getUserInfo,
	login,
	deleteUser,
	updateUser,
	changePassword,getListUser
};
