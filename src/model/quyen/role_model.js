
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const roleModel = new mongoose.Schema({
    id: {
        type:Number,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('RoleModel', roleModel);