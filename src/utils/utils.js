const userRoleModel = require("../model/user_role_model");
const baseJson = require("./base_json");
const moment = require('moment');

function getNowFormatted() {
    return moment().format('yyyy/MM/DD HH:mm:ss');
}

function getMoreFormatted(more) {
    return  moment().subtract(-more,"minutes").format('yyyy/MM/DD HH:mm:ss');
}

function afterNow(date1) {
    return !moment(date1,'yyyy/MM/DD HH:mm:ss').isAfter(moment());
}

function getMoreTime(more) {
    var datetime = new Date();
    var dateString = new Date(
        datetime.getTime() - datetime.getTimezoneOffset() * 60000 + more *60000
    );

    return dateString.toISOString().replace("T", " ").substr(0, 19);
}

function convertDateTime(date) {
    var dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return dateString.toISOString().replace("T", " ").substr(0, 19);
}

function getNowMilliseconds(){
    return Number(Date.now());
}

async function verifyRole(res, {userId, roleId}) {
    var userRole = await userRoleModel.find({idUser: userId});
    for (var i = 0; i < userRole.length; i++) {
        if (userRole[i].idRole === roleId) {
            return true;
        }
    }
    return false;
}

module.exports = {getNowFormatted, verifyRole, convertDateTime,getMoreTime,getNowMilliseconds,getMoreFormatted,afterNow};
