const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

mongoose.Promise = global.Promise;

const userDepartmentModel = new mongoose.Schema({
	id: Number,
	idUser: Number,
	idDepartment: Number,
});

autoIncrement.initialize(mongoose.connection);
userDepartmentModel.plugin(autoIncrement.plugin, {
	model: "UserDepartmentModel", // collection or table name in which you want to apply auto increment
	field: "id", // field of model which you want to auto increment
	startAt: 1, // start your auto increment value from 1
	incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model("UserDepartmentModel", userDepartmentModel);
