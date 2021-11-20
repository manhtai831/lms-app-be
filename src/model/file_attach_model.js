const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

mongoose.Promise = global.Promise;

const FileAttachModel = new mongoose.Schema({
    id: {
        type: Number,
        immutable: true,
    },
    name: {
        type: String,
        required: true,
    },

    link:String,
    idUser:Number,
    user:Object,
    idClass:Number,
    class:Object,
    idDocument:Number,
    idDocumentType:Number,
    documentType:Object,

    createdAt: String,
    createdBy: Number,
    updatedAt: String,
    updatedBy: Number,
});

autoIncrement.initialize(mongoose.connection);
FileAttachModel.plugin(autoIncrement.plugin, {
    model: "file_attach", // collection or table name in which you want to apply auto increment
    field: "id", // field of model which you want to auto increment
    startAt: 1, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model("file_attach", FileAttachModel);
