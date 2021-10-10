const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');


mongoose.Promise = global.Promise;


const departmentModel = new mongoose.Schema({
    id: Number,
    name: {
        type: String,
        required: true,
    },
    userName: String,
    password: String,
    email: String,
    phoneNumber: String,
    birth:String,
    token: String,
    permission: [],
    avatar:Object
});

autoIncrement.initialize(mongoose.connection);
departmentModel.plugin(autoIncrement.plugin, {
    model: "departmentModel", // collection or table name in which you want to apply auto increment
    field: "id", // field of model which you want to auto increment
    startAt: 1, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model('DepartmentModel', departmentModel);