const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const ReposityModel = require("../../model/resposity");
const {
    getNowFormatted,
    verifyRole,
    convertDateTime
} = require("../../utils/utils");

const userModel = require("../../model/user_model");
const Class = require("../../model/class_model");
const {create_class, get_all_class, update_class, delete_class, register_class, get_reposity,} = require("../../utils/role_json");
const {baseJsonPage} = require("../../utils/base_json");


async function getResposity(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: get_reposity.id,
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
        .findOne({id: req.user.id});

    if (req.body.title == null) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Name class is required"})
            );
    }
    const  resposity = ReposityModel({
        title:req.body.title,
        content: req.body.content,
        createdAt: getNowFormatted(),
        createdBy: user,
    })
    return resposity
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
        .select("id name description createAt createBy updateAt updateBy").exec((error, result) => {
            Class.countDocuments(async (err1, count) => {
                for (var i = 0; i < result.length; i++) {
                    result[i].createBy = await userModel.findOne({id: result[i].createBy.id}).select("id name userName email avatar");
                }
                return res.status(status.success).json(
                    baseJson.baseJson({
                        code: 0,
                        data: baseJsonPage(
                            Number(index),
                            Number(size),
                            count,
                            result
                        ),
                    })
                );
            });
            if (error) return baseJson.baseJson({
                code: 99,

            })
        })

}

async function updateClass(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: update_class.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }
    if (req.body.id == null) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "ID class is required"})
            );
    }

    const user = await userModel
        .findOne({id: req.user.id})
        .select("id name userName email");

    return Class
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

async function deleteClass(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: delete_class.id,
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
                baseJson.baseJson({code: 99, message: "Id is required"})
            );
    }

    return Class
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
    getResposity,
    getAllClass,
    updateClass,
    deleteClass

};
