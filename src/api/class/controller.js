const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const {
    getNowFormatted,
    verifyRole,
    convertDateTime
} = require("../../utils/utils");

const userModel = require("../../model/user_model");
const Class = require("../../model/class_model");
const SubjectModel = require("../../model/subject_model");
const {create_class, get_all_class, update_class, delete_class, register_class,} = require("../../utils/role_json");
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
        idSubject: req.body.idSubject,
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
    var filter;
    if (req.query.idSubject) {
        filter = {idSubject: req.query.idSubject};
    }
    if (req.query.name) {
        filter=   { "name": { "$regex": req.query.name, "$options": "i" } }
        // filter = {title :req.query.title}
    }

    await Class
        .find(filter)
        .exec(async (error, result) => {
            var datatmp = result;
            for (var i = 0; i < datatmp.length; i++) {
                // result[i].createBy = await userModel.findOne({id: result[i].createBy.id}).select("id name userName email avatar");
                datatmp[i].subject = await SubjectModel.findOne({id: datatmp[i].idSubject});
                console.log(datatmp[i].subject)
            }
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 0,
                    data: baseJsonPage(
                        Number(index),
                        Number(size),
                        datatmp.length,
                        datatmp
                    ),
                })
            );
        });


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
    if (req.body.id == null) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Id is required"})
            );
    }

    return Class
        .deleteOne({id: req.body.id})
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
    updateClass,
    deleteClass

};
