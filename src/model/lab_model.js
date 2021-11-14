const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

mongoose.Promise = global.Promise;

const labModel = new mongoose.Schema({
	id: {
		type: Number,
		immutable: true,
	},
	title: String,
	content: String,
	userId: String,    type:String,

	documentId: Number,
	startTime: String,
	endTime: String,
	createdAt: Date,
	createdBy: Number,
	updatedAt: Date,
	updatedBy: Number,
});

autoIncrement.initialize(mongoose.connection);
labModel.plugin(autoIncrement.plugin, {
	model: "lab_model", // collection or table name in which you want to apply auto increment
	field: "id", // field of model which you want to auto increment
	startAt: 1, // start your auto increment value from 1
	incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model("lab_model", labModel);
