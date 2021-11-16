const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

mongoose.Promise = global.Promise;

const departmentModel = new mongoose.Schema({
	id: {
		type: Number,
		immutable: true,
	},
	name: {
		type: String,
		required: true,
	},
	idSemester:Number,
	semester: Object,
	image:String,
	status:Number,
	description: String,
	createAt: String,
	createBy: Object,
	updateAt: String,
	updateBy: Object,
});

autoIncrement.initialize(mongoose.connection);
departmentModel.plugin(autoIncrement.plugin, {
	model: "DepartmentModel", // collection or table name in which you want to apply auto increment
	field: "id", // field of model which you want to auto increment
	startAt: 1, // start your auto increment value from 1
	incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model("DepartmentModel", departmentModel);
