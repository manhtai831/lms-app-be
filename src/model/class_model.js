
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const userModel = require("../model/user_model");
mongoose.Promise = global.Promise;

const classModel = new mongoose.Schema({
    id: Number,
    name: {
        type: String,
        required:true,
    },
    description:String,
    numberOfPeople:{
        type:Number,
        immutable:true
    },
    createAt: Date,
    createBy: Object,
    createBy1: String,
    updateAt: Date,
    updateBy: Object,
});

autoIncrement.initialize(mongoose.connection);
classModel.plugin(autoIncrement.plugin, {
    model: "Class", // collection or table name in which you want to apply auto increment
    field: "id", // field of model which you want to auto increment
    startAt: 1, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model("Class", classModel);
