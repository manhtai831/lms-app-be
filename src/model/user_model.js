const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

mongoose.Promise = global.Promise;

const userModel = new mongoose.Schema({
	id: Number,
	name: {
		type: String,
	},
	userName: {
		type: String,
		immutable: true,
	},
	password: String,
	email: String,
	data: String,
	gender: String,
	address: String,
	maSV: String,
	status: Number,
	phoneNumber: String,
	birth: String,
	token: String,
	permission: [],
	listClassId:[],
	listClass:[],
	idGroup: Number,
	nameGroup: String,
	avatar: String,
	chuyenNganh: Object,
	chuyenNganhId: Number,
	kiHoc : Object,
	kiHocId : Number,
	fcmToken :String
});

autoIncrement.initialize(mongoose.connection);
userModel.plugin(autoIncrement.plugin, {
	model: "User", // collection or table name in which you want to apply auto increment
	field: "id", // field of model which you want to auto increment
	startAt: 1, // start your auto increment value from 1
	incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model("User", userModel);
