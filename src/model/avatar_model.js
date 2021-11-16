const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

mongoose.Promise = global.Promise;

const avatarModel = new mongoose.Schema({
    id: {
        type: Number,
        immutable: true,
    },
    image:String,
});

autoIncrement.initialize(mongoose.connection);
avatarModel.plugin(autoIncrement.plugin, {
    model: "avatar_model", // collection or table name in which you want to apply auto increment
    field: "id", // field of model which you want to auto increment
    startAt: 1, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model("avatar_model", avatarModel);
