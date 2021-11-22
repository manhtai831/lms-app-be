const Question = require("../../model/question_model");
const AnswerModel = require("../../model/answer_model");
const UserModel = require("../../model/user_model");
const DocumentTypeModel = require("../../model/document_type_model");
const SubjectModel = require("../../model/subject_model");
const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const {
    getNowFormatted,
    verifyRole,
    convertDateTime,
} = require("../../utils/utils");
const {
    create_question,
    get_detail_question,
    get_all_questions,
    update_question,
    delete_question,
} = require("../../utils/role_json");
const {baseJsonPage} = require("../../utils/base_json");
const Answer = require("../../model/answer_model");

const createQuestion = async (req, res, next) => {
    try{
        //check role
        var hasRole = await verifyRole(res, {
            roleId: create_question.id,
            userId: req.user.id,
        });
        if (hasRole === false) {
            return res
                .status(status.success)
                .json(
                    baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
                );
        }
        // if (req.body.idDanhMuc == null) {
        //     return res
        //         .status(status.success)
        //         .json(
        //             baseJson.baseJson({code: 99, message: "\"idDanhMuc\" is required"})
        //         );
        // }
        if (req.body.idMonHoc == null) {
            return res
                .status(status.success)
                .json(
                    baseJson.baseJson({code: 99, message: "\"idMonHoc\" is required"})
                );
        }
        // if (req.body.idDapAp == null) {
        //     return res
        //         .status(status.success)
        //         .json(
        //             baseJson.baseJson({code: 99, message: "\"idDapAp\" is required"})
        //         );
        // }
        // if (req.body.listCauTraLoi == null) {
        //     return res
        //         .status(status.success)
        //         .json(
        //             baseJson.baseJson({code: 99, message: "\"listCauTraLoi\" is required"})
        //         );
        // } //set data

        const questionModel = new Question({
            content: req.body.content,
            idDanhMuc: req.body.idDanhMuc,
            idMonHoc: req.body.idMonHoc,
            createdAt: getNowFormatted(),
            createdBy: req.user.id,
        });
        questionModel
            .save().then(async (value) => {
            var lCauTraLoiID = [];
            for (var i = 0; i < req.body.listCauTraLoiObject.length; i++) {
                const answerModel = new Answer({
                    content: req.body.listCauTraLoiObject[i].content,
                    idCauHoi: value.id,
                    createdAt: getNowFormatted(),
                    createdBy: req.user.id,
                });
                await answerModel.save().then((v1)=>{
                    lCauTraLoiID.push(v1.id);
                });

                if (i === req.body.idDapAp) {//Lấy vị trí của đáp án từ list ở client
                    await Question.updateOne({id: value.id}, {
                        $set: {
                            idDapAp: answerModel.id,
                        }
                    })
                }

            }
            await Question.updateOne({id: value.id}, {
                $set: {
                    listCauTraLoi: lCauTraLoiID,
                }
            })

        })
        return res.status(status.success).json(
            baseJson.baseJson({
                code: 0,
                // data: data,
            })
        );
    }catch (e){
        return res.status(status.success).json(
            baseJson.baseJson({
                code: 9,
                // data: data,
            })
        );
    }


};

const getDetailQuestionById = async (req, res, next) => {
    //check roles
    var hasRole = await verifyRole(res, {
        roleId: get_detail_question.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }

    //find question by id
    Question.findOne({id: req.query.id})
        .then((data) => {
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 0,
                    message: "get detail question finish!",
                    data: data,
                })
            );
        })
        .catch((error) => {
            next(error);
        });
};

const getAllQuestions = async (req, res, next) => {
    //check role
    var hasRole = await verifyRole(res, {
        roleId: get_all_questions.id,
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
    if (req.query.idDanhMuc) {
        filter = {idDanhMuc: req.query.idDanhMuc}
    }
    if (req.query.idMonHoc) {
        filter = {idMonHoc: req.query.idMonHoc}
    }

    // find all questions
    Question.find(filter)
        .then(async (data) => {

            var listQuestion = data;
            for (var i = 0; i < listQuestion.length; i++) {
                var lCauTraLoi = [];
                for (var j = 0; j < listQuestion[i].listCauTraLoi.length; j++) {
                    var lC = await AnswerModel.findOne({id: listQuestion[i].listCauTraLoi[j]}).select("idCauHoi content id");
                    if (lC)
                        lCauTraLoi.push(lC);

                }
                // listQuestion[i].mCreatedBy = await UserModel.findOne({id: listQuestion[i].createdBy}).select("id name")
                listQuestion[i].danhMuc = await DocumentTypeModel.findOne({id: listQuestion[i].idDanhMuc}).select("id name")
                listQuestion[i].monHoc = await SubjectModel.findOne({id: listQuestion[i].idMonHoc}).select("id name")
                listQuestion[i].listCauTraLoiObject = lCauTraLoi;

            }

            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 0,
                    data: baseJsonPage(0, 0, data.length, listQuestion),
                })
            );
        })
        .catch((error) => {
            next(error);
        });
};

const getAllQuestionsQuick = async (req, res, next) => {
    //check role
    var hasRole = await verifyRole(res, {
        roleId: get_all_questions.id,
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
    if (req.query.idDanhMuc) {
        filter = {idDanhMuc: req.query.idDanhMuc}
    }
    if (req.query.idMonHoc) {
        filter = {idMonHoc: req.query.idMonHoc}
    }

    // find all questions
    Question.find(filter)
        .then(async (data) => {
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

const deleteQuestion = async (req, res, next) => {
    //check role
    var hasRole = await verifyRole(res, {
        roleId: delete_question.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }
    if (req.body.id == null) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "\"id\" is required"})
            );
    }
    //delete question by id
    Question.deleteOne({id: req.body.id})
        .then(() => {
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 0
                })
            );
        })
        .catch((error) => {
            next(error);
        });
};

const updateQuestion = async (req, res) => {
    //check role
    var hasRole = await verifyRole(res, {
        roleId: update_question.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }
    if (req.body.id == null) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "\"id\" is required"})
            );
    }
    //update question
    Question.updateOne(
        //update by id
        {id: req.body.id},
        //set and update data
        {
            $set: {
                content: req.body.content,
                idDanhMuc: req.body.idDanhMuc,
                idMonHoc: req.body.idMonHoc,
                idDapAp: req.body.idDapAp,
                listCauTraLoi: req.body.listCauTraLoi,
                updatedBy: req.user.id,
                updatedAt: getNowFormatted(),
            },
        }
    )
        .then(() => {
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

module.exports = {
    createQuestion,
    getDetailQuestionById,
    getAllQuestions,
    deleteQuestion,
    updateQuestion,getAllQuestionsQuick
};
