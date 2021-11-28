
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

mongoose.Promise = global.Promise;

const RepoDepartmentModel = new mongoose.Schema({
    id: Number,
    
    idRepo: {
        type: Number,
        required: true,
    },
    repo: Object,
    idDepartment: {
        type: Number,
        required: true,
    },
    department:Object,
});

autoIncrement.initialize(mongoose.connection);
RepoDepartmentModel.plugin(autoIncrement.plugin, {
    model: "RepoDepartmentModel", // collection or table name in which you want to apply auto increment
    field: "id", // field of model which you want to auto increment
    startAt: 1, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model("RepoDepartmentModel", RepoDepartmentModel);