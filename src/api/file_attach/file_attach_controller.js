const {verifyRole, getNowFormatted} = require("../../utils/utils");
const {create_document_type, create_file_attach, get_list_file_attach} = require("../../utils/role_json");
const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const FileAttachModel = require("../../model/file_attach_model");
const UserModel = require("../../model/user_model");
const ClassModel = require("../../model/class_model");
const DocumentTypeModel = require("../../model/document_type_model");
const {baseJsonPage} = require("../../utils/base_json");
const {uploadImage} = require("../../utils/image");

async function createFileAttach(req, res) {
    //check role
    var hasRole = await verifyRole(res, {
        roleId: create_file_attach.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }
    if (req.body.idDocumentType == null) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "\"idDocumentType\" is required"})
            );
    }
    if (req.body.idClass == null) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "\"idClass\" is required"})
            );
    }
    var resp;
    if (req.body.data) {
        var a = await uploadImage(req.body.data);
        if (a) {
            resp = a.url;
        }
    }
    //set data
    const fileAttachModel = new FileAttachModel({
        name: req.body.name,
        link: resp,
        idUser: req.user.id,
        idClass: req.body.idClass,
        idDocumentType: req.body.idDocumentType,
        createdAt: getNowFormatted(),
        createdBy: req.user.id,
    });

    //add data
    return fileAttachModel.save()
        .then((data) => {
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 0
                })
            );
        })
        .catch((error) => {
            console.log(error);
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 99
                })
            );
        });
}

async function getListFileAttach(req, res) {
    //check role
    var hasRole = await verifyRole(res, {
        roleId: get_list_file_attach.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }

    var filter;
    if (req.query.idClass && req.query.idDocumentType) {
        filter = {
            idClass: req.query.idClass,
            idDocumentType: req.query.idDocumentType,
        }
    } else if (req.query.idClass) {
        filter = {idClass: req.query.idClass,}
    } else if (req.query.idDocumentType) {
        filter = {idDocumentType: req.query.idDocumentType,}
    }
else if (req.query.idDocumentType && req.query.idUser) {
        filter = {idDocumentType: req.query.idDocumentType,idUser:req.query.idUser}
    }

    //add data
    return FileAttachModel.find(filter)
        .then((data) => {
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 0,
                    data: baseJsonPage(0, 0, data.length, data)
                })
            );
        })
        .catch((error) => {
            console.log(error);
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 99
                })
            );
        });
}

async function getDetailFileAttach(req, res) {
    // //check role
    // var hasRole = await verifyRole(res, {
    //     roleId: get_list_file_attach.id,
    //     userId: req.user.id,
    // });
    // if (hasRole === false) {
    //     return res
    //         .status(status.success)
    //         .json(
    //             baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
    //         );
    // }


    //add data
    return FileAttachModel.findOne({id: req.query.id})
        .then(async (data) => {
            var d = data;
            if(d){
                d.user = await  UserModel.findOne({id:d.idUser}).select("id name");
                d.class = await  ClassModel.findOne({id:d.idClass}).select("id name");
                d.documentType = await  DocumentTypeModel.findOne({id:d.idDocumentType}).select("id name");
            }

            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 0,
                    data: d
                })
            );
        })
        .catch((error) => {
            console.log(error);
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 99
                })
            );
        });
}

async function updateFileAttach(req, res) {
    if(req.body.id == null){
        return res.status(status.success).json(
            baseJson.baseJson({
                code: 99,message:"\"id\" is required"
            })
        );
    }
    var resp;
    if (req.body.data) {
        var a = await uploadImage(req.body.data);
        if (a) {
            resp = a.url;
        }
    }else resp = req.body.link;
    const fileAttachModel = {
        name: req.body.name,
        link:resp,
        createdAt: getNowFormatted(),
        createdBy: req.user.id,
    };

    //add data
    return FileAttachModel.updateOne({id:req.body.id},{$set:fileAttachModel})
        .then((data) => {
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 0
                })
            );
        })
        .catch((error) => {
            console.log(error);
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 99
                })
            );
        });
}

async function deleteFileAttach(req, res) {
    if(req.body.id == null){
        return res.status(status.success).json(
            baseJson.baseJson({
                code: 99,message:"\"id\" is required"
            })
        );
    }
    return FileAttachModel.deleteOne({id: req.body.id})
        .then((data) => {
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 0
                })
            );
        })
        .catch((error) => {
            console.log(error);
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 99
                })
            );
        });
}

module.exports = {
    createFileAttach,
    getListFileAttach,
    updateFileAttach,
    deleteFileAttach,getDetailFileAttach
};

