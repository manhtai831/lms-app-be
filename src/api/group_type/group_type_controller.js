const {baseJson, baseJsonPage} = require("../../utils/base_json");
const UserRoleModel = require("../../model/user_role_model");
const RoleModel = require("../../model/role_model");
const GroupTypeModel = require("../../model/group_type");
const ClassModel = require("../../model/class_model");
const status = require("../../utils/status");
const {set} = require("mongoose");
const {getNowFormatted} = require("../../utils/utils");

async function createGroupType(req, res) {
    try {
        if(req.body.idClass == null){
            return res
                .status(status.server_error)
                .json(baseJson({code: 99, message: "\"idClass\" is required"}));
        }
        // var list = [];
        // if (req.body.idClass)
        //     list.push(req.body.idClass);
        var group = GroupTypeModel({
            name: req.body.name,
            description: req.body.description,
            idClass: req.body.idClass,
            // listClass: list,
            createAt: getNowFormatted(),
            createBy: req.user.id
        });
        await group.save().then(async (data) => {
            if (req.body.idClass) {
                var mClass = await ClassModel.findOne({id: req.body.idClass});
                var listG;
                if (mClass.listGroupType) {
                    listG = mClass.listGroupType;
                } else listG = [];
                listG.push(data.id);
                await ClassModel.updateOne({id: req.body.idClass}, {
                    $set: {
                        listGroupType: listG
                    }
                });
            }
            return res.status(status.success).json(baseJson({code: 0}));
        });
    } catch (error) {
        console.log(error);
        return res
            .status(status.server_error)
            .json(baseJson({code: 99, message: error}));
    }
}

async function getAllGroupType(req, res) {
    try {
        GroupTypeModel.find({idClass : req.query.idClass}).then(async (data) => {

            return res
                .status(status.success)
                .json(baseJson({code: 0, data: baseJsonPage(0, 0, data.length, data)}));
        });
    } catch (error) {
        console.log(error);
        return res
            .status(status.server_error)
            .json(baseJson({code: 99, message: error}));
    }
}

async function updateGroupType(req, res) {
    try {

        if (req.body.id == null){
            return res
                .status(200)
                .json(baseJson({code: 99, data: '\"id\" is required'}));
        }
        // if (req.body.listClass == null){
        //     return res
        //         .status(200)
        //         .json(baseJson({code: 99, data: '\"list class\" is required'}));
        // }
        var groupType = {
            name: req.body.name,
            description: req.body.description,
            listClass: req.body.listClass,
            updateAt: getNowFormatted(),
            updateBy: req.user.id,

        };
        GroupTypeModel.updateOne({id: req.body.id}, {$set: groupType}).then((r) => {
            return res.status(status.success).json(baseJson({code: 0}));
        });
    } catch (error) {
        console.log(error);
        return res
            .status(status.server_error)
            .json(baseJson({code: 99, message: error}));
    }
}

async function deleteGroupType(req, res) {
    if (req.body.id == null)
        return res
        .status(200)
        .json(baseJson({code: 99, data: 'id is required'}));
    GroupTypeModel.deleteOne({id: req.body.id})
        .then((data) => {
            return res.status(status.success).json(baseJson({code: 0}));
        })
        .catch((error) => {
            console.log(error);
            return res.status(status.success).json(baseJson({code: 99}));
        });

}

module.exports = {
    createGroupType,
    getAllGroupType,
    updateGroupType,
    deleteGroupType
};
