const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const {
    getNowFormatted,
    verifyRole,
    convertDateTime
} = require("../../utils/utils");

const userModel = require("../../model/user_model");
const Class = require("../../model/class_model");
const {create_class, get_all_class,} = require("../../utils/role_json");
const {baseJsonPage} = require("../../utils/base_json");

async function createClass(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: create_class.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }
    const user = await userModel
        .findOne({id: req.user.id})
        .select("id name userName email");
    if (req.body.name == null) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Name class is required"})
            );
    }
    const classModel = new Class({
        name: req.body.name,
        description: req.body.description,
        createAt: getNowFormatted(),
        createBy: user,
    });

    return classModel
        .save()
        .then((newData) => {
            return res.status(status.success).json(baseJson.baseJson({code: 0}));
        })
        .catch((error) => {
            console.log(error);
            res.status(status.server_error).json(baseJson.baseJson({code: 99}));
        });
}

async function getAllClass(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: get_all_class.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }


    const index = req.query.pageIndex || 1;
    const size = req.query.pageSize || 50;
    await Class
        .find()
        .skip(Number(index) * Number(size) - Number(size))
        .limit(Number(size))
        .select("id name description createAt createBy updateAt updateBy")
        .exec((err, allData) => {

            Class.countDocuments((err1, count) => {
                if (err || Number(index) === 0)
                    return res.status(status.server_error).json(
                        baseJson.baseJson({
                            code: 99,
                            message: Number(index) === 0 ? "Error Index" : err.message,
                        })
                    );
                var dataCallback = [];
                for  (var i = 0;i< count;i++) {
                    var data =JSON.stringify(allData[i]);
                    console.log(data);
                    // const user1 =  userModel
                    //     .findOne({id: allData[i].createBy.id})
                    //     .select("id name userName email");
                    // allData[i].creatBy = user1;
                    // dataCallback.push(allData[i].creatBy);

                }

                return res.status(status.success).json(
                    baseJson.baseJson({
                        code: 0,
                        data: baseJsonPage(
                            Number(index),
                            Number(size),
                            count,
                            allData
                        ),
                    })
                );
            });
        });
}

async function updateDepartment(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: cap_nhat_nganh.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }
    if (req.body.name == null) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Name department is required"})
            );
    }

    const user = await userModel
        .findOne({id: req.user.id})
        .select("id name userName email  ");

    return departmentModel
        .updateOne(
            {id: req.body.id},
            {
                $set: {
                    updateAt: getNowFormatted(),
                    updateBy: user,
                    name: req.body.name,
                    description: req.body.description,
                },
            }
        )
        .then(() => {
            return res.status(status.success).json(baseJson.baseJson({code: 0}));
        })
        .catch((error) => {
            console.log(error);
            res.status(status.server_error).json(baseJson.baseJson({code: 99}));
        });
}

async function deleteDepartment(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: xoa_nganh.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }
    if (req.query.id == null) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Id department is required"})
            );
    }

    return departmentModel
        .deleteOne({id: req.query.id})
        .then(() => {
            return res.status(status.success).json(baseJson.baseJson({code: 0}));
        })
        .catch((error) => {
            console.log(error);
            res.status(status.server_error).json(baseJson.baseJson({code: 99}));
        });
}

module.exports = {
    createClass,
    getAllClass,
    updateDepartment,
    deleteDepartment,
};
