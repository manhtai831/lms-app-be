const mongoose =require( 'mongoose');
const autoIncrement = require('mongoose-auto-increment');

mongoose.Promise = global.Promise;

const courseSchema = new mongoose.Schema({
    id: Number,
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

autoIncrement.initialize(mongoose.connection);
courseSchema.plugin(autoIncrement.plugin, {
    model: "courses", // collection or table name in which you want to apply auto increment
    field: "id", // field of model which you want to auto increment
    startAt: 1, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model('Course', courseSchema);