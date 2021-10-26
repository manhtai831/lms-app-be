const {verifyRole, getNowFormatted} = require("../../utils/utils");
const {create_document_type, create_file_attach, get_list_file_attach} = require("../../utils/role_json");
const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const FileAttachModel = require("../../model/file_attach_model");

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
    //set data
    const fileAttachModel = new FileAttachModel({
        name: req.body.name,
        link: req.body.link,
        idUser: req.user.id,
        idDocument: req.body.idDocument,
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


    //add data
    return FileAttachModel.find()
        .then((data) => {
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 0,
                    data: data
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

async function getListFileAttachByIdUser(req, res) {

    return FileAttachModel.find({idUser: req.user.id})
        .then((data) => {
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 0,
                    data: data
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

async function getListFileAttachByIdDocument(req, res) {

    return FileAttachModel.find({idDocument: req.query.id})
        .then((data) => {
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 0,
                    data: data
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

async function getListFileAttachByIdTypeDocument(req, res) {

    return FileAttachModel.find({idDocumentType: req.query.id})
        .then((data) => {
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 0,
                    data: data
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
    await  FileAttachModel.deleteOne({id: req.body.id});
    //set data
    const fileAttachModel = new FileAttachModel({
        name: req.body.name,
        link: req.body.link,
        idUser: req.user.id,
        idDocument: req.body.idDocument,
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

async function deleteFileAttach(req, res) {
    return  FileAttachModel.deleteOne({id: req.body.id})
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
    createFileAttach,getListFileAttach,getListFileAttachByIdUser,getListFileAttachByIdDocument,getListFileAttachByIdTypeDocument
    ,updateFileAttach,deleteFileAttach
};

