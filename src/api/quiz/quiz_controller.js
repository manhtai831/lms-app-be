const Quiz = require("../../model/quiz_model");
const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const {
    getNowFormatted,
    verifyRole,
    convertDateTime,
} = require("../../utils/utils");
const {
    create_lab,
    get_detail_lab,
    get_all_labs,
    update_lab,
    delete_lab, create_quiz, get_quiz,
} = require("../../utils/role_json");
const {baseJsonPage} = require("../../utils/base_json");

const createQuiz = async (req, res, next) => {
    //check role
    var hasRole = await verifyRole(res, {
        roleId: create_quiz.id,
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
    const quizModel = new Quiz({
        title: req.body.title,
        content: req.body.content, type: "QUIZ",

        userId: req.body.userId,
        documentId: req.body.documentId,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        createdAt: getNowFormatted(),
        createdBy: req.user.id,
    });

    //add data
    return quizModel
        .save()
        .then((data) => {
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

const getAllQuiz = async (req, res, next) => {
    //check role
    var hasRole = await verifyRole(res, {
        roleId: get_quiz.id,
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
    if (req.query.idDocument) {
        filter = {documentId: req.query.idDocument}
    }

    // find all labs
    Quiz.find(filter)
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

const deleteLab = async (req, res, next) => {
    //check role
    var hasRole = await verifyRole(res, {
        roleId: delete_lab.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
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

const updatelab = async (req, res) => {
    //check role
    var hasRole = await verifyRole(res, {
        roleId: update_lab.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
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
    createQuiz,
    getAllQuiz,
};
