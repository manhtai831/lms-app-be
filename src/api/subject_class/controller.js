const {verifyRole, getNowFormatted} = require("../../utils/utils");
const {create_class, add_class_to_subject, add_class_of_subject} = require("../../utils/role_json");
const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const userModel = require("../../model/user_model");
const Class = require("../../model/class_model");
const RoleModel = require("../../model/role_model");
const UserRoleModel = require("../../model/user_role_model");
const SubjectClassModel = require("../../model/subject_class_model");
const SubjectModel = require("../../model/subject_model");

async function addClassToSubject(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: add_class_to_subject.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }
    const listClass = req.body.idClasses;
    console.log(req.body);
    const mSubject = await SubjectModel.findOne({id: req.body.idSubject});
    if (mSubject) {
        await SubjectClassModel.deleteMany({idSubject: req.body.idSubject});
        listClass.forEach(async (element) => {
            const mClass = await Class.findOne({id: element});
            if (mClass) {
                const subjectClassModel = new SubjectClassModel({
                    idClass: element,
                    idSubject: req.body.idSubject,
                });
                await subjectClassModel.save();
            } else {
                return res.status(status.success).json(baseJson.baseJson({
                    code: 0,
                    message: 'Không có lớp học' + element
                }));

            }
        });
        return res.status(status.success).json(baseJson.baseJson({code: 0}));

    } else {
        return res.status(status.success).json(baseJson.baseJson({code: 1, message: 'Không có môn học'}));
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
    addClassToSubject, getClassOfSubject
}
