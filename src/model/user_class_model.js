const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

mongoose.Promise = global.Promise;

const userClassModel = new mongoose.Schema({
    id: Number,

    idClass: {
        type: Number,
        required: true,
    },
    // class: Object,
    idUser: {
        type: Number,
        required: true,
    },
    user:Object
});

autoIncrement.initialize(mongoose.connection);
userClassModel.plugin(autoIncrement.plugin, {
    model: "UserClassModel", // collection or table name in which you want to apply auto increment
    field: "id", // field of model which you want to auto increment
    startAt: 1, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model("UserClassModel", userClassModel);
