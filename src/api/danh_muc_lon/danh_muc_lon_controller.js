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
const {
    create_class,
    get_all_class,
    update_class,
    delete_class,
    register_class,
    get_reposity,
    create_reposity,
} = require("../../utils/role_json");
const {baseJsonPage} = require("../../utils/base_json");
const {uploadImage} = require("../../utils/image");


async function createResposity(req, res) {
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
        .findOne({id: req.user.id}).select("name");

    if (req.body.title == null) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Name repository is required"})
            );
    }
    var resp;
    if (req.body.data) {
        var a = await uploadImage(req.body.data);
        if (a) {
            resp = a.url;
        }
    }
    const resposity = ReposityModel({
        title: req.body.title,
        content: req.body.content,
        image: resp,
        createdAt: getNowFormatted(),
        createdBy: user,
        updateAt: null,
        updateBy: null
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


async function getRepository(req, res) {
    // var hasRole = await verifyRole(res, {
    //     roleId: create_reposity.id,
    //     userId: req.user.id,
    // });
    // if (hasRole === false) {
    //     return res
    //         .status(status.success)
    //         .json(
    //             baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
    //         );
    // }
    var filter;
    if (req.query.title) {
        filter=   { "title": { "$regex": req.query.title, "$options": "i" } }
        // filter = {title :req.query.title}
    }

    await ReposityModel
        .find(filter)
        .exec((error, result) => {
            if (error) return baseJson.baseJson({
                code: 99,
            });
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 0,
                    data: baseJsonPage(0, 0, result.length, result)
                }));


        })

}

async function updateRepository(req, res) {
    /* var hasRole = await verifyRole(res, {
         roleId: update_class.id,
         userId: req.user.id,
     });
     if (hasRole === false) {
         return res
             .status(status.success)
             .json(
                 baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
             );
     }*/
    if (req.body.id == null) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "ID repository is required"})
            );
    }

    const user = await userModel
        .findOne({id: req.user.id})
        .select(" name ");
    var resp;
    if (req.body.data) {
        var a = await uploadImage(req.body.data);
        if (a) {
            resp = a.url;
        }
    }
    return ReposityModel
        .updateOne(
            {id: req.body.id},
            {
                $set: {
                    updateAt: getNowFormatted(),
                    updateBy: user,
                    title: req.body.title,
                    content: req.body.content,
                    image: resp
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

async function deleteRepository(req, res) {
    /*ar hasRole = await verifyRole(res, {
        roleId: delete_class.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }*/
    if (req.body.id == null) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Id is required"})
            );
    }

    return ReposityModel
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
    createResposity,
    getRepository,
    updateRepository,
    deleteRepository

};
