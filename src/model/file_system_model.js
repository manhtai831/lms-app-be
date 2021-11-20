const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

mongoose.Promise = global.Promise;

const fileSystemModel = new mongoose.Schema({
    id: {
        type: Number,
        immutable: true,
    },
    name:String,
    description:String,
    idClass:Number,
    idSubject:Number,
    listClass:[],
    linkFile:String,
    createAt:String,
    createBy: Number,
    updateAt:String,
    updateBy:Number,
});

autoIncrement.initialize(mongoose.connection);
fileSystemModel.plugin(autoIncrement.plugin, {
    model: "file_system", // collection or table name in which you want to apply auto increment
    field: "id", // field of model which you want to auto increment
    startAt: 1, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model("file_system", fileSystemModel);
