
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

mongoose.Promise = global.Promise;

const subjectClassModel = new mongoose.Schema({
    id: Number,

    idClass: {
        type: Number,
        required: true,
    },
    idSubject: {
        type: Number,
        required: true,
    },
});

autoIncrement.initialize(mongoose.connection);
subjectClassModel.plugin(autoIncrement.plugin, {
    model: "SubjectClassModel", // collection or table name in which you want to apply auto increment
    field: "id", // field of model which you want to auto increment
    startAt: 1, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model("SubjectClassModel", subjectClassModel);
