const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const {
    getNowFormatted,
    verifyRole,
    convertDateTime
} = require("../../utils/utils");

const userModel = require("../../model/user_model");
const SemesterModel = require("../../model/semester_model");
const Class = require("../../model/class_model");
const {create_class, get_all_class, update_class, delete_class, register_class, add_semester, get_all_semester,
    update_semester, delete_semester,} = require("../../utils/role_json");
const {baseJsonPage} = require("../../utils/base_json");


async function createSemester(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: add_semester.id,
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
    const semesterModel = new SemesterModel({
        name: req.body.name,
        description: req.body.description,
        createAt: getNowFormatted(),
        createBy: user,
    });

    return semesterModel
        .save()
        .then((newData) => {
            return res.status(status.success).json(baseJson.baseJson({code: 0}));
        })
        .catch((error) => {
            console.log(error);
            res.status(status.server_error).json(baseJson.baseJson({code: 99}));
        });
}


async function getAllSemester(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: get_all_semester.id,
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
    await SemesterModel
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

async function updateSemester(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: update_semester.id,
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
                baseJson.baseJson({code: 99, message: "ID semester is required"})
            );
    }

    const user = await userModel
        .findOne({id: req.user.id})
        .select("id name userName email");

    return SemesterModel
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

async function deleteSemester(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: delete_semester.id,
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

    return SemesterModel
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
    createSemester,
    getAllSemester,
    updateSemester,
    deleteSemester
};
