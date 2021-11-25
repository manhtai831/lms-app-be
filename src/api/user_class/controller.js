const {verifyRole} = require("../../utils/utils");
const {register_class} = require("../../utils/role_json");
const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const UserClassModel = require("../../model/user_class_model");
const Class = require("../../model/class_model");
const userModel = require("../../model/user_model");
const {baseJsonPage} = require("../../utils/base_json");


async function registerClass(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: register_class.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }
    var availableClass = await Class.findOne({id: req.body.idClass});
    if (availableClass === null) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Không tồn tại"})
            );
    }
    var availableClass = await UserClassModel.findOne({idUser: req.user.id, idClass: req.query.idClass});
    if (availableClass) {
        var userClassModel = new UserClassModel({
            idUser: req.user.id,
            idClass: req.body.idClass
        });
        return userClassModel.save()
            .then((data) => {
                return res.status(status.success).json(baseJson.baseJson({code: 0}));
            })
            .catch((error) => {
                console.log(error);
                return res
                    .status(status.server_error)
                    .json(baseJson.baseJson({code: 99, message: error}));
            });
    } else {
        return res
            .status(status.server_error)
            .json(baseJson.baseJson({code: 1, message: 'Đã đăng ký'}));
    }

}

async function getRegisteredClass(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: register_class.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }

    var availableClass = await UserClassModel.findOne({idUser: req.user.id, idClass: req.query.idClass});
    if (availableClass != null) {
        await Class
            .findOne({id: req.query.idClass}).select()
            .then(async (result) => {
                result.createBy = await userModel.findOne({id: result.createBy.id}).select("id name userName email avatar");
                return res.status(status.success).json(baseJson.baseJson({code: 0, data: result}));
            })
            .catch((error) => {
                console.log(error);
                return res.status(status.success).json(baseJson.baseJson({code: 99, data: error}));
            });
    } else {
        return res.status(status.success).json(baseJson.baseJson({code: 1, message: 'Lớp chưa được đăng ký'}));
    }
}

async function getUserOfClass(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: register_class.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }

    // if (availableClass != null) {
    await UserClassModel
        .find({idClass: req.query.idClass}).select()
        .then(async (result) => {
            for (var i = 0; i < result.length; i++) {
                11
                result[i].user = await userModel.findOne({id: result[i].idUser}).select("name email phoneNumber userName birth avatar address chuyenNganh kiHoc gender idGroup")
            }

            return res.status(status.success).json(baseJson.baseJson({
                code: 0,
                data: baseJsonPage(0, 0, result.length, result)
            }));
        })
        .catch((error) => {
            console.log(error);
            return res.status(status.success).json(baseJson.baseJson({code: 99, data: error}));
        });
    // } else {
    //     return res.status(status.success).json(baseJson.baseJson({code: 1, message: 'Lớp chưa được đăng ký'}));
    // }
}

async function cancelRegisteredClass(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: register_class.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }

    var availableClass = await UserClassModel.findOne({idUser: req.user.id, idClass: req.body.idClass});
    if (availableClass) {
        await UserClassModel
            .findOneAndRemove({idUser: req.user.id, idClass: req.body.idClass})
            .then((result) => {
                return res.status(status.success).json(baseJson.baseJson({code: 0}));
            })
            .catch((error) => {
                console.log(error);
                return res.status(status.success).json(baseJson.baseJson({code: 0, data: error}));
            });
    } else {
        return res.status(status.success).json(baseJson.baseJson({code: 1, message: 'Lớp chưa được đăng ký'}));
    }
}

module.exports = {
    registerClass,
    getRegisteredClass, getUserOfClass,
    cancelRegisteredClass
};
