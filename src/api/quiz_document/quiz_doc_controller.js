const {verifyRole, getNowFormatted} = require("../../utils/utils");
const {
    create_class,
    add_class_to_subject,
    add_class_of_subject,
    add_a_class_to_a_subject, delete_a_class_in_a_subject
} = require("../../utils/role_json");
const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const userModel = require("../../model/user_model");
const Class = require("../../model/class_model");
const RoleModel = require("../../model/role_model");
const UserRoleModel = require("../../model/user_role_model");
const SubjectClassModel = require("../../model/subject_class_model");
const SubjectModel = require("../../model/subject_model");
const QuizDocModel = require("../../model/quiz_doc_model");
const QuestionModel = require("../../model/question_model");
const {createClass} = require("../class/controller");
const {baseJsonPage} = require("../../utils/base_json");
const AnswerModel = require("../../model/answer_model");

async function getQuestionByDanhMuc(req, res) {
    // var hasRole = await verifyRole(res, {
    //     roleId: add_class_to_subject.id,
    //     userId: req.user.id,
    // });
    // if (hasRole === false) {
    //     return res
    //         .status(status.success)
    //         .json(
    //             baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
    //         );
    // }


    return QuizDocModel.find({idDanhMuc: req.query.idDanhMuc}).then(async (data) => {
        var mData = data;
        var listQuestion = [];
        for(var i = 0; i< mData.length; i++){
            var question = await QuestionModel.findOne({id: mData[i].idCauHoi});
            var lCauTraLoi = [];
            for (var j = 0; j < question.listCauTraLoi.length; j++) {
                var lC = await AnswerModel.findOne({id: question.listCauTraLoi[j]}).select("idCauHoi content id");
                if (lC)
                    lCauTraLoi.push(lC);

            }  question.listCauTraLoiObject = lCauTraLoi;
            listQuestion.push(question);
        }

        return res.status(status.success).json(baseJson.baseJson({
            code: 0,
            data: baseJsonPage(0, 0, listQuestion.length, listQuestion)
        }));
    });


}

async function addAClassToASubject(req, res) {
    //Tạo mới class
    var hasRoleClass = await verifyRole(res, {
        roleId: create_class.id,
        userId: req.user.id,
    });
    var hasRole = await verifyRole(res, {
        roleId: add_a_class_to_a_subject.id,
        userId: req.user.id,
    });
    if (hasRole === false || hasRoleClass === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }

    const user = await userModel
        .findOne({id: req.user.id})
        .select("id name userName email");

    const classModel = new Class({
        name: req.body.name,
        description: req.body.description,
        createAt: getNowFormatted(),
        createBy: user,
    });

    const mSubject = await SubjectModel.findOne({id: req.body.idSubject});

    if (mSubject) {
        return classModel
            .save()
            .then(async (result) => {
                const subjectClassModel = new SubjectClassModel({
                    idClass: result.id,
                    idSubject: req.body.idSubject,
                });
                await subjectClassModel.save();
                return res.status(status.success).json(baseJson.baseJson({
                    code: 0,
                    message: 'Thêm lớp học thành công'
                }));
            })
            .catch((error) => {
                console.log(error);
                return res.status(status.server_error).json(baseJson.baseJson({
                    code: 99,
                    message: 'Tạo mới lớp không thành công'
                }));
            });
    } else {
        return res.status(status.server_error).json(baseJson.baseJson({code: 99, message: 'Môn học không tồn tại'}));

    }

}

async function deleteAClassInASubject(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: delete_a_class_in_a_subject.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }

    const mSubject = await SubjectModel.findOne({id: req.query.idSubject});
    const mClass = await Class.findOne({id: req.query.idClass});

    if (mSubject && mClass) {
        return SubjectClassModel.findOneAndRemove({idSubject: mSubject.id, idClass: mClass.id})
            .then(async (result) => {
                return res.status(status.success).json(baseJson.baseJson({
                    code: 0,
                    message: 'Xóa thành công'
                }));
            })
            .catch((error) => {
                console.log(error);
                return res.status(status.server_error).json(baseJson.baseJson({
                    code: 99,
                    message: 'Xóa không thành công'
                }));
            });
    } else {
        return res.status(status.server_error).json(baseJson.baseJson({
            code: 99,
            message: 'Môn học hoặc lớp học không tồn tại'
        }));

    }

}

async function getClassOfSubject(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: add_class_of_subject.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }

    console.log(req.query.idSubject);
    var mSubjectClass = await SubjectClassModel.find({idSubject: req.query.idSubject});
    if (mSubjectClass) {
        var listClass = [];
        for (var i = 0; i < mSubjectClass.length; i++) {
            const mClass = await Class.findOne({id: mSubjectClass[i].idClass});
            listClass.push(mClass);
        }

        console.log(listClass);
        return res.status(status.success).json(baseJson.baseJson({code: 0, data: listClass}));
    } else {
        return res.status(status.success).json(baseJson.baseJson({code: 1, message: 'Không có môn học'}));
    }
}

module.exports = {
    getQuestionByDanhMuc, getClassOfSubject, addAClassToASubject, deleteAClassInASubject
}
