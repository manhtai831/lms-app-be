const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

mongoose.Promise = global.Promise;

const QuizInfoModel = new mongoose.Schema({
    id: {
        type: Number,
        immutable: true,
    },
    idDocumentType:Number,
    idUser:Number,
    startTime:String,
    endTime:String
});

autoIncrement.initialize(mongoose.connection);
QuizInfoModel.plugin(autoIncrement.plugin, {
    model: "QuizInfoModel", // collection or table name in which you want to apply auto increment
    field: "id", // field of model which you want to auto increment
    startAt: 1, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model("QuizInfoModel", QuizInfoModel);
