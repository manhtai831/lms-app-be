
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const userModel = require("../model/user_model");
mongoose.Promise = global.Promise;

const semesterModel = new mongoose.Schema({
    id: Number,
    name: {
        type: String,
        required:true,
    },
    description:String,
    idRepository:Number,
    startTime: String,
    endTime:String,
    repository:Object,
    numberOfPeople:{
        type:Number,
        immutable:true
    },
    status:Number,
    createAt: String,
    createBy: Object,
    updateAt: String,
    updateBy: Object,
});

autoIncrement.initialize(mongoose.connection);
semesterModel.plugin(autoIncrement.plugin, {
    model: "SemesterModel", // collection or table name in which you want to apply auto increment
    field: "id", // field of model which you want to auto increment
    startAt: 1, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model("SemesterModel", semesterModel);
