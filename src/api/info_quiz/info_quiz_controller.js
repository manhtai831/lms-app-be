const Lab = require("../../model/lab_model");
const InfoQuizModel = require("../../model/quiz_info_model");
const DocumentTypeModel = require("../../model/document_type_model");
const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const {
    getNowFormatted,
    verifyRole, compare,
    convertDateTime, getMoreTime, getMoreFormatted, afterNow,
} = require("../../utils/utils");
const {
    create_lab,
    get_detail_lab,
    get_all_labs,
    update_lab,
    delete_lab,
} = require("../../utils/role_json");
const {baseJsonPage} = require("../../utils/base_json");

const updateInfoQuiz = async(req, res, next) => {
    //check role
    // var hasRole = await verifyRole(res, {
    //     roleId: create_lab.id,
    //     userId: req.user.id,
    // });
    // if (hasRole === false) {
    //     return res
    //     .status(status.success)
    //     .json(
    //         baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
    //     );
    // }
    
    
    let QuizInfoModel = InfoQuizModel({
        idUser: req.user.id,
        idDocumentType: req.body.idDocumentType,
        startTime: getNowFormatted(),
        endTime: getMoreFormatted(15)
    });
    return QuizInfoModel
    .save()
    .then((data) => {
        return res.status(status.success).json(
            baseJson.baseJson({
                code: 0,
                data: data
            })
        );
    })
    .catch((error) => {
        return res.status(status.success).json(
            baseJson.baseJson({
                code: 99, data: error
            })
        );
    });
    
    
};

const getInfoQuiz = async(req, res, next) => {
    
    return InfoQuizModel.findOne({idUser: req.user.id, idDocumentType: req.query.idDocumentType,})
    .then(async(data) => {
        let documentType = await DocumentTypeModel.findOne({id: req.query.idDocumentType});
        if(data === null) {
            //trường hợp endTime nhỏ hơn thời gian hiện tại
            if(afterNow(documentType.endTime)) {
                return res.status(status.success).json(
                    baseJson.baseJson({
                        code: 3, message: "Đã hết thời gian làm bài",
                    })
                );
            }
            //trường hợp endTime lơn hơn thời gian hiện tại
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 0, message: "Chưa bắt đầu làm bài",
                })
            );
            
        } else {
            //trường hợp đã ấn nút bắt đầu hêt thời gian làm bài
            if(afterNow(data.endTime)) {
                return res.status(status.success).json(
                    baseJson.baseJson({
                        code: 1, message: "Đã hết giờ làm bài",
                    })
                );
            }            //trường hợp đã ấn nút bắt đầu còn thời gian làm bài
            
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 2, message: "Đang làm bài", data: data
                })
            );
        }
        
    })
    .catch((error) => {
        return res.status(status.success).json(
            baseJson.baseJson({
                code: 99, data: error
            })
        );
    });
};

const getAllLabs = async(req, res, next) => {
    //check role
    var hasRole = await verifyRole(res, {
        roleId: get_all_labs.id,
        userId: req.user.id,
    });
    if(hasRole === false) {
        return res
        .status(status.success)
        .json(
            baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
        );
    }
    var filter;
    if(req.query.idDocument) {
        filter = {documentId: req.query.idDocument}
    }
    
    // find all labs
    Lab.find(filter)
    .then((data) => {
        return res.status(status.success).json(
            baseJson.baseJson({
                code: 0,
                data: baseJsonPage(0, 0, data.length, data),
            })
        );
    })
    .catch((error) => {
        next(error);
    });
};

const deleteLab = async(req, res, next) => {
    //check role
    var hasRole = await verifyRole(res, {
        roleId: delete_lab.id,
        userId: req.user.id,
    });
    if(hasRole === false) {
        return res
        .status(status.success)
        .json(
            baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
        );
    }
    
    //delete lab by id
    Lab.deleteOne({id: req.query.id})
    .then(() => {
        return res.status(status.success).json(
            baseJson.baseJson({
                code: 0,
                message: "delete lab finish!",
                data: req.query.id,
            })
        );
    })
    .catch((error) => {
        next(error);
    });
};

const updatelab = async(req, res) => {
    //check role
    var hasRole = await verifyRole(res, {
        roleId: update_lab.id,
        userId: req.user.id,
    });
    if(hasRole === false) {
        return res
        .status(status.success)
        .json(
            baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
        );
    }
    
    //update lab
    Lab.updateOne(
        //update by id
        {id: req.query.id},
        //set and update data
        {
            $set: {
                userId: req.body.userId,
                title: req.body.title,
                content: req.body.content,
                documentTypeId: req.body.documentTypeId,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                updatedBy: req.user.id,
                updatedAt: getNowFormatted(),
            },
        }
    )
    .then(() => {
        return res.status(status.success).json(
            baseJson.baseJson({
                code: 0,
                message: "update lab finish!",
            })
        );
    })
    .catch((error) => {
        next(error);
    });
};

module.exports = {
    updateInfoQuiz,
    getInfoQuiz,
    getAllLabs,
    deleteLab,
    updatelab,
};
