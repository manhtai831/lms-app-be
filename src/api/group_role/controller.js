const {baseJson, baseJsonPage} = require("../../utils/base_json");
const UserRoleModel = require("../../model/user_role_model");
const RoleModel = require("../../model/role_model");
const GroupRoleModel = require("../../model/group_role");
const status = require("../../utils/status");
const {set} = require("mongoose");

async function createGroup(req, res) {
    try {
        var group = GroupRoleModel({
            name: req.body.name,
            roles: req.body.roles,
            description: req.body.description
        })
        group.save().then((data) => {
            return res.status(status.success).json(baseJson({code: 0}));
        })

    } catch (error) {
        console.log(error);
        return res
            .status(status.server_error)
            .json(baseJson({code: 99, message: error}));
    }
}

async function getAllGroup(req, res) {
    try {

        GroupRoleModel.find().then(async (data) => {
            return res
                .status(status.success)
                .json(baseJson({code: 0, data: baseJsonPage(0, 0, data.length, data)}));
        });
        // var dataTmp = data;
        // for(var i =0; i< dataTmp.length;i++){
        // 	var role = RoleModel.findOne({id: dataTmp[i]})
        // 		.select("id name")
        // 		.then((role) => {
        // 			return res
        // 				.status(status.success)
        // 				.json(baseJson({ code: 0, data: role }));
        // 		});
        // }
    } catch (error) {
        console.log(error);
        return res
            .status(status.server_error)
            .json(baseJson({code: 99, message: error}));
    }
}

async function updateGroup(req, res) {
    try {
        if (req.body.name == null) {
            return res
                .status(status.success)
                .json(baseJson({code: 99, message: "Name is required"}));
        }if (req.body.id == null) return res
            .status(200)
            .json(baseJson({code: 99, data: 'id is required'}));
        const role ={
            name: req.body.name,
            description: req.body.description,
            roles: req.body.roles,
        };
        GroupRoleModel.updateOne({id:req.body.id},{$set:role}).then((r) => {
            return res.status(status.success).json(baseJson({code: 0}));
        });
    } catch (error) {
        console.log(error);
        return res
            .status(status.server_error)
            .json(baseJson({code: 99, message: error}));
    }
}

async function deleteGroup(req, res) {
    if (req.body.id == null) return res
        .status(200)
        .json(baseJson({code: 99, data: 'id is required'}));
    GroupRoleModel.deleteOne({id: req.body.id})
        .then((data) => {
            return res.status(status.success).json(baseJson({code: 0}));
        })
        .catch((error) => {
            console.log(error);
            return res.status(status.success).json(baseJson({code: 99}));
        });

}

module.exports = {
    createGroup,
    updateGroup,
    deleteGroup,
    getAllGroup,
};
