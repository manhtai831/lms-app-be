const {baseJson, baseJsonPage} = require("../../utils/base_json");
const UserRoleModel = require("../../model/user_role_model");
const RoleModel = require("../../model/role_model");
const FileSystemModel = require("../../model/file_system_model");
const GroupTypeModel = require("../../model/file_system_model");
const ClassModel = require("../../model/class_model");
const status = require("../../utils/status");
const {set} = require("mongoose");
const {getNowFormatted} = require("../../utils/utils");
const {uploadImage} = require("../../utils/image");

async function createFileSystem(req, res) {
    try {
        if(req.body.idClass == null){
            return res
                .status(status.server_error)
                .json(baseJson({code: 99, message: "\"idClass\" is required"}));
        }
        var resp;
        if (req.body.data) {
            var a = await uploadImage(req.body.data);
            if (a) {
                resp = a.url;
            }
        }
        var group = FileSystemModel({
            name: req.body.name,
            description: req.body.description,
            idClass: req.body.idClass,
            idSubject: req.body.idSubject,
            linkFile:resp,
            createAt: getNowFormatted(),
            createBy: req.user.id
        });
        await group.save().then(async (data) => {
            if (req.body.idClass) {
                var mClass = await ClassModel.findOne({id: req.body.idClass});
                var listG;
                if (mClass.listFileSystem) {
                    listG = mClass.listFileSystem;
                } else listG = [];
                listG.push(data.id);
                await ClassModel.updateOne({id: req.body.idClass}, {
                    $set: {
                        listFileSystem: listG
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

async function getAllFileSystem(req, res) {
    try {
        var filter;
        if(req.query.idSubject){
            filter = {idSubject : req.query.idSubject};
        }else if(req.query.idClass){
            filter = {idClass : req.query.idClass};
        }
        FileSystemModel.find(filter).then(async (data) => {

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

async function updateFileSystem(req, res) {
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
        var resp;
        if (req.body.data) {
            var a = await uploadImage(req.body.data);
            if (a) {
                resp = a.url;
            }
        }else{
            resp = req.body.linkFile;
        }
        var groupType = {
            name: req.body.name,
            description: req.body.description,
            idClass: req.body.idClass,
            linkFile: resp,
            updateAt: getNowFormatted(),
            updateBy: req.user.id,

        };
        FileSystemModel.updateOne({id: req.body.id}, {$set: groupType}).then((r) => {
            return res.status(status.success).json(baseJson({code: 0}));
        });
    } catch (error) {
        console.log(error);
        return res
            .status(status.server_error)
            .json(baseJson({code: 99, message: error}));
    }
}

async function deleteFileSystem(req, res) {
    if (req.body.id == null)
        return res
            .status(200)
            .json(baseJson({code: 99, data: 'id is required'}));
    FileSystemModel.deleteOne({id: req.body.id})
        .then((data) => {
            return res.status(status.success).json(baseJson({code: 0}));
        })
        .catch((error) => {
            console.log(error);
            return res.status(status.success).json(baseJson({code: 99}));
        });

}

module.exports = {
    createFileSystem,
    getAllFileSystem,
    updateFileSystem,
    deleteFileSystem
};
