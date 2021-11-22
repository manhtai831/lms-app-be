const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

mongoose.Promise = global.Promise;

const QuizDocModel = new mongoose.Schema({
    id: Number,

    idDanhMuc: {
        type: Number,
        required: true,
    },
    idCauHoi: {
        type: Number,
        required: true,
    },
});

autoIncrement.initialize(mongoose.connection);
QuizDocModel.plugin(autoIncrement.plugin, {
    model: "QuizDocModel", // collection or table name in which you want to apply auto increment
    field: "id", // field of model which you want to auto increment
    startAt: 1, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model("QuizDocModel", QuizDocModel);
