const Lab = require("../../model/lab_model");
const InfoQuizModel = require("../../model/quiz_info_model");
const DocumentTypeModel = require("../../model/document_type_model");
const UserModel = require("../../model/user_model");
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
        console.log(data);
        
        if(data == null) {
            //trường hợp endTime nhỏ hơn thời gian hiện tại
            if(!afterNow(documentType.endTime)) {
                return res.status(status.success).json(
                    baseJson.baseJson({
                        code: 3, message: "Đã hết thời gian làm bài", data: data
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
            let user = await UserModel.findOne({id: data.idUser}).select("id name");
            data.documentType = documentType;
            data.user = user;
            //trường hợp đã ấn nút bắt đầu hêt thời gian làm bài
            if(afterNow(data.endTime)) {
                return res.status(status.success).json(
                    baseJson.baseJson({
                        code: 1, message: "Đã hết giờ làm bài", data: data
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
        console.log(error);
        return res.status(status.success).json(
            baseJson.baseJson({
                code: 99, data: error
            })
        );
    });
};

const getInfoMoreQuiz = async(req, res, next) => {
    if(req.query.idDocumentType == null){
        return res.status(status.success).json(
            baseJson.baseJson({
                code: 99, message: "idDocumentType is required"
            })
        );
    }
    let listDocumentType = await DocumentTypeModel.find();
    
    let listUser = await UserModel.find().select("id name");
    return InfoQuizModel.find({idDocumentType: req.query.idDocumentType,})
    .then(async(data) => {
       for(var i =0; i< data.length;i++){
           for( var j =0; j< listDocumentType.length ;j++){
               if(data[i].idDocumentType === listDocumentType[j].id){
                   data[i].documentType = listDocumentType[j];
               }
           }
            for( var k =0; k< listUser.length ;k++){
               if(data[i].idUser === listUser[k].id){
                   data[i].user = listUser[k];
               }
           }
           
       }
       
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 0, data: baseJsonPage(0,0,data.length,data)
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

const updatePointInfoQuiz = async(req, res, next) => {
    //check role
    // var hasRole = await verifyRole(res, {
    //     roleId: get_all_labs.id,
    //     userId: req.user.id,
    // });
    // if(hasRole === false) {
    //     return res
    //     .status(status.success)
    //     .json(
    //         baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
    //     );
    // }
    var filter;
    if(req.body.idDocumentType) {
        filter = {idDocumentType: req.body.idDocumentType,idUser: req.user.id}
    }
    
    // find all labs
    InfoQuizModel.updateOne(filter, {$set: {point: req.body.point, endTime: getNowFormatted()}})
    .then((data) => {
        return res.status(status.success).json(
            baseJson.baseJson({
                code: 0, data: data
            })
        );
    })
    .catch((error) => {
        return res.status(status.success).json(
            baseJson.baseJson({
                code: 0, data: error
            })
        );
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
    updatePointInfoQuiz,getInfoMoreQuiz,
    deleteLab,
    updatelab,
};
