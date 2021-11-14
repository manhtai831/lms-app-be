const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

mongoose.Promise = global.Promise;

const assigmentModel = new mongoose.Schema({
	id: {
		type: Number,
		immutable: true,
	},
	title: String,
	content: String,
	userId: Number,
	documentId: Number,
	startTime: String,
	endTime: String,
	createdAt: Date,
	createdBy: Number,
	updatedAt: Date,
	updatedBy: Number,
});

autoIncrement.initialize(mongoose.connection);
assigmentModel.plugin(autoIncrement.plugin, {
	model: "assigment_model", // collection or table name in which you want to apply auto increment
	field: "id", // field of model which you want to auto increment
	startAt: 1, // start your auto increment value from 1
	incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model("assigment_model", assigmentModel);
