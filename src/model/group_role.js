const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

mongoose.Promise = global.Promise;

const groupRoleModel = new mongoose.Schema({
    id: {
        type: Number,
        immutable: true,
    },
    name:String,
    description:String,
    roles: [],
});

autoIncrement.initialize(mongoose.connection);
groupRoleModel.plugin(autoIncrement.plugin, {
    model: "group_role", // collection or table name in which you want to apply auto increment
    field: "id", // field of model which you want to auto increment
    startAt: 1, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model("group_role", groupRoleModel);
