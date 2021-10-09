
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

mongoose.Promise = global.Promise;


const roleModel = new mongoose.Schema({
    id: Number,
    name: {
        type: String,
        required: true,
    },
});

autoIncrement.initialize(mongoose.connection);
roleModel.plugin(autoIncrement.plugin, {
    model: "RoleModel", // collection or table name in which you want to apply auto increment
    field: "id", // field of model which you want to auto increment
    startAt: 1, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model('RoleModel', roleModel);