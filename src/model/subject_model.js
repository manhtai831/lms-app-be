const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

mongoose.Promise = global.Promise;

const subjectModel = new mongoose.Schema({
	id: {
		type: Number,
		immutable: true,
	},
	name: {
		type: String,
		required: true,
	},
	idDepartment:Number,
	status:Number,
	data:String,
	department:Object,
	description: String,
	createdAt: String,
	createdBy: Object,
	updatedAt: String,
	updatedBy: Object,
});

autoIncrement.initialize(mongoose.connection);
subjectModel.plugin(autoIncrement.plugin, {
	model: "Subject", // collection or table name in which you want to apply auto increment
	field: "id", // field of model which you want to auto increment
	startAt: 1, // start your auto increment value from 1
	incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model("Subject", subjectModel);
