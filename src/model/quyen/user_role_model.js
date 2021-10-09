
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

mongoose.Promise = global.Promise;


const userRoleModel = new mongoose.Schema({
    id: Number,
    name: {
        type: String
    },
    idRole: {
        type: Number,
        required: true,
    },
    idUser: {
        type: Number,
        required: true,
    },
});

autoIncrement.initialize(mongoose.connection);
userRoleModel.plugin(autoIncrement.plugin, {
    model: "UserRoleModel", // collection or table name in which you want to apply auto increment
    field: "id", // field of model which you want to auto increment
    startAt: 34, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model('UserRoleModel', userRoleModel);