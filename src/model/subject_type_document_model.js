
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

mongoose.Promise = global.Promise;

const subjectTDocumentModel = new mongoose.Schema({
    id: Number,

    idSubject: {
        type: Number,
        required: true,
    },
    idTypeDocument: {
        type: Number,
        required: true,
    },
});

autoIncrement.initialize(mongoose.connection);
subjectTDocumentModel.plugin(autoIncrement.plugin, {
    model: "SubjectTDocumentModel", // collection or table name in which you want to apply auto increment
    field: "id", // field of model which you want to auto increment
    startAt: 1, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model("SubjectTDocumentModel", subjectTDocumentModel);
