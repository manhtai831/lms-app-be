const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

mongoose.Promise = global.Promise;

const DocumentModel = new mongoose.Schema({
	id: {
		type: Number,
		immutable: true,
	},
	name: {
		type: String,
		required: true,
	},
	content: String,
	description: String,
	createAt: Date,
	createBy: Number,
	updateAt: Date,
	updateBy: Number,
});

autoIncrement.initialize(mongoose.connection);
DocumentModel.plugin(autoIncrement.plugin, {
	model: "Document", // collection or table name in which you want to apply auto increment
	field: "id", // field of model which you want to auto increment
	startAt: 1, // start your auto increment value from 1
	incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model("Document", DocumentModel);
