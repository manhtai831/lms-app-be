const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const AnswerModel = require("../model/answer_model")

mongoose.Promise = global.Promise;

const questionModel = new mongoose.Schema({
	id: {
		type: Number,
		immutable: true,
	},
	content: String,
	listCauTraLoi:[],
	listCauTraLoiObject:[],
	idDanhMuc:Number,
	listDanhMuc:[],
	danhMuc:Object,
	idMonHoc:Number,
	monHoc:Object,
	idDapAp:Number,
	createdAt: String,
	createdBy: Number,
	mCreatedBy: Object,
	updatedAt: String,
	updatedBy: Number,
});

autoIncrement.initialize(mongoose.connection);
questionModel.plugin(autoIncrement.plugin, {
	model: "question_model", // collection or table name in which you want to apply auto increment
	field: "id", // field of model which you want to auto increment
	startAt: 1, // start your auto increment value from 1
	incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model("question_model", questionModel);
