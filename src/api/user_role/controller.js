const {baseJson, baseJsonPage} = require("../../utils/base_json");
const UserRoleModel = require("../../model/user_role_model");
const RoleModel = require("../../model/role_model");
const status = require("../../utils/status");
const {set} = require("mongoose");

async function addRoleToAccount(req, res) {
    try {
        const listRole = req.body;
        console.log(req.body);
        UserRoleModel.deleteMany({idUser: req.user.id});
        for (var i = 0; i < listRole.length; i++) {
            // const role = RoleModel.findOne({ id: listRole[i] });

            // if (role) {
            const userRoleModel = new UserRoleModel({
                idUser: req.user.id,
                idRole: listRole[i],
                // name: role.name,
            });
            // await UserRoleModel.findOneAndRemove({ idRole: listRole[i] });
            await userRoleModel.save();
            // }
        }
        return res.status(status.success).json(baseJson({code: 0}));
    } catch (error) {
        console.log(error);
        return res
            .status(status.server_error)
            .json(baseJson({code: 99, message: error}));
    }
}

async function getAllRole(req, res) {
    try {
        var listRole = req.body;
        var response = [];
        if (listRole.length > 0) {
            for (var i = 0; i < listRole.length; i++) {
                var r = await RoleModel.findOne({id: listRole[i]})

                response.push(r);

            }
            return res
                .status(status.success)
                .json(baseJson({code: 0, data: baseJsonPage(0,0,response.length,response)}));
        }
        RoleModel.find().sort({ id: 1})
            .select("id name")
            .then((role) => {
                return res
                    .status(status.success)
                    .json(baseJson({code: 0, data: baseJsonPage(0,0,role.length,role)}));
            });
    } catch (error) {
        console.log(error);
        return res
            .status(status.server_error)
            .json(baseJson({code: 99, message: error}));
    }
}

async function addRole(req, res) {
    try {
        console.log(req.body);
        if (req.body.name == null) {
            return res
                .status(status.success)
                .json(baseJson({code: 99, message: "Name is required"}));
        }
        const role = RoleModel({
            id: req.body.id,
            name: req.body.name,
            description: req.body.description,
        });
        role.save().then((r) => {
            return res.status(status.success).json(baseJson({code: 0}));
        });
    } catch (error) {
        console.log(error);
        return res
            .status(status.server_error)
            .json(baseJson({code: 99, message: error}));
    }
}

async function updateRole(req, res) {
    try {
        console.log(req.body);
        if (req.body.name == null) {
            return res
                .status(status.success)
                .json(baseJson({code: 99, message: "Name is required"}));
        }
        var role = await RoleModel.findOne({id: req.body.id});
        if (role == null) {
            return res
                .status(status.success)
                .json(baseJson({code: 99, message: "Kh??ng t??m th???y quy???n n??y"}));
        }
        RoleModel.updateOne({id: req.body.id}, {$set: req.body})
            .exec()
            .then((data) => {
                return res.status(status.success).json(baseJson({code: 0}));
            })
            .catch((error) => {
                console.log(error);
                return res.status(status.success).json(baseJson({code: 99}));
            });
    } catch (error) {
        console.log(error);
        return res
            .status(status.server_error)
            .json(baseJson({code: 99, message: error}));
    }
}

async function deleteRole(req, res) {
    try {
        console.log(req.query.id);
        var role = await RoleModel.findOne({id: req.query.id});
        if (role == null) {
            return res
                .status(status.success)
                .json(baseJson({code: 99, message: "Kh??ng t??m th???y quy???n n??y"}));
        }
        RoleModel.deleteOne({id: req.query.id})
            .exec()
            .then((data) => {
                return res.status(status.success).json(baseJson({code: 0}));
            })
            .catch((error) => {
                console.log(error);
                return res.status(status.success).json(baseJson({code: 99}));
            });
    } catch (error) {
        console.log(error);
        return res
            .status(status.server_error)
            .json(baseJson({code: 99, message: error}));
    }
}

module.exports = {
    addRoleToAccount,
    addRole,
    updateRole,
    getAllRole,
    deleteRole,
};
