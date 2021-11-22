const DocumentType = require("../../model/document_type_model");
const UserModel = require("../../model/user_model");
const ClassModel = require("../../model/class_model");
const GroupTypeModel = require("../../model/group_type");
const SubjectModel = require("../../model/subject_model");
const QuestionModel = require("../../model/question_model");
const QuizDocModel = require("../../model/quiz_doc_model");
const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const {
    getNowFormatted,
    verifyRole,
    convertDateTime,
} = require("../../utils/utils");
const {
    create_document_type,
    get_document_type,
    update_document_type,
    delete_document_type,
    get_detail_document_type, get_document_type_in_subject_class,
} = require("../../utils/role_json");
const {baseJsonPage} = require("../../utils/base_json");

const createDocumentType = async (req, res, next) => {
    //check role
    var hasRole = await verifyRole(res, {
        roleId: create_document_type.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }
    if (req.body.idGroupType == null) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "\"idGroupType\" is required"})
            );
    }
    if (req.body.startTime == null || req.body.endTime == null) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "\"startTime and endTime\" is required"})
            );
    }

    var user = UserModel.findOne({id: req.user.id});


    //set data
    const DocumentTypeModel = new DocumentType({
        name: req.body.name,
        description: req.body.description,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        listQuestion: req.body.listQuestion,
        type: req.body.type,
        idGroupType: req.body.idGroupType,
        createdAt: getNowFormatted(),
        createdBy: req.user.id,
    });

    //add data
    return DocumentTypeModel.save()
        .then((data) => {
            if (req.body.type === 'QUIZ') {
                if (req.body.listQuestion) {
                    req.body.listQuestion.forEach(async (element) => {
                        var quizDoc = QuizDocModel({
                            idDanhMuc: data.id,
                            idCauHoi: element,
                        });
                        await quizDoc.save();
                    })
                }

            }
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 0,
                })
            );
        })
        .catch((error) => {
            next(error);
        });
};

const getDocumentTypeById = async (req, res, next) => {
    //check roles
    var hasRole = await verifyRole(res, {
        roleId: get_detail_document_type.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }

    //find document type by id
    DocumentType.findOne({id: req.query.id})
        .select("id name")
        .then((data) => {
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 0,
                    message: "get detail document type finish!",
                    data: data,
                })
            );
        })
        .catch((error) => {
            next(error);
        });
};

const getDocumentTypeByClassOrSubject = async (req, res, next) => {
    //check roles
    var hasRole = await verifyRole(res, {
        roleId: get_document_type_in_subject_class.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }
    if (req.query.isSubject === 'TRUE') {
        //find document type by id
        DocumentType.find({idSubject: req.query.id})
            .select("id name idSubject idClass")
            .then((data) => {
                return res.status(status.success).json(
                    baseJson.baseJson({
                        code: 0,
                        data: data,
                    })
                );
            })
            .catch((error) => {
                next(error);
            });
    } else {
        //find document type by id
        DocumentType.find({idClass: req.query.id})
            .select("id name idSubject idClass")
            .then((data) => {
                return res.status(status.success).json(
                    baseJson.baseJson({
                        code: 0,
                        data: data,
                    })
                );
            })
            .catch((error) => {
                next(error);
            });
    }

};

const getDocumentTypes = async (req, res, next) => {
    //check role
    var hasRole = await verifyRole(res, {
        roleId: get_document_type.id,
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
    if (req.query.idGroupType) {
        filter = {
            idGroupType: req.query.idGroupType,
        }
    }
    // find all document types
    DocumentType.find(filter).sort({"name": 1})
        .then(async (data) => {
            var datatmp = data;
            // for (var i = 0; i < datatmp.length; i++) {
            //     datatmp[i].class = await ClassModel.findOne({id: datatmp[i].idClass});
            //     datatmp[i].subject = await SubjectModel.findOne({id: datatmp[i].idSubject});
            //     console.log(await UserModel.findOne({id: datatmp[i].createdBy}));
            //     datatmp[i].oCreatedBy = await UserModel.findOne({id: datatmp[i].createdBy}).select("id name");
            //
            // }
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 0,
                    data: baseJsonPage(0, 0, datatmp.length, datatmp),
                })
            );
        })
        .catch((error) => {
            next(error);
            return res.status(400).json(baseJson.baseJson({
                code: 99, data: error
            }))
        });
};

const getDetailDocumentType = async (req, res, next) => {
    // //check role
    // var hasRole = await verifyRole(res, {
    //     roleId: get_document_type.id,
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
    if (req.query.id) {
        filter = {
            id: req.query.id,
        }
    }
    // find all document types
    DocumentType.findOne(filter)
        .then(async (data) => {
            var d = data;

            if (d) {

                var grouptype = await GroupTypeModel.findOne({id: d.idGroupType});
                if (grouptype) {
                    d.groupType = grouptype;
                    var cla = await ClassModel.findOne({id: grouptype.idClass});
                    d.class = cla;
                }
            }

            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 0,
                    data: d,
                })
            );
        })
        .catch((error) => {
            next(error);
            return res.status(400).json(baseJson.baseJson({
                code: 99, data: error
            }))
        });
};

const DeleteDocumentType = async (req, res, next) => {
    //check role
    var hasRole = await verifyRole(res, {
        roleId: delete_document_type.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }

    //delete document type by id
    DocumentType.deleteOne({id: req.body.id})
        .then((data) => {
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 0,
                })
            );
        })
        .catch((error) => {
            next(error);
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 99,
                })
            );
        });
};

const UpdateDocumentType = async (req, res) => {
    //check role
    var hasRole = await verifyRole(res, {
        roleId: update_document_type.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }
    if (req.body.idGroupType === null) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "\"idGroupType\" is required"})
            );
    }
    if (req.body.id === null) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "\"id\" is required"})
            );
    }

    //update subject
    return DocumentType.updateOne({id: req.body.id}, {
        $set: {
            name: req.body.name,
            description: req.body.description,
            endTime: req.body.endTime,
            startTime: req.body.startTime,
            idGroupType: req.body.idGroupType,
            listQuestion: req.body.listQuestion,
            type: req.body.type,
            updatedBy: req.user.id,
            updatedAt: getNowFormatted(),
        }
    }).then(async (result) => {
        if (req.body.type === 'QUIZ') {
            await QuizDocModel.deleteMany({idDanhMuc: req.body.id})
            if (req.body.listQuestion) {
                req.body.listQuestion.forEach(async (element) => {
                    var quizDoc = QuizDocModel({
                        idDanhMuc: req.body.id,
                        idCauHoi: element,
                    });
                    await quizDoc.save();
                })
            }

        }
        return res.status(status.success).json(
            baseJson.baseJson({
                code: 0
            })
        );
    }).catch((error) => {
            console.log(error);
        });
};

module.exports = {
    createDocumentType,
    getDocumentTypes,
    DeleteDocumentType,
    UpdateDocumentType,
    getDocumentTypeById,
    getDocumentTypeByClassOrSubject, getDetailDocumentType
};
