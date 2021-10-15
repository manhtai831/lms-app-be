const {verifyRole, getNowFormatted} = require("../../utils/utils");
const {create_class, add_class_to_subject, add_class_of_subject, add_semester_to_user, get_all_semester_of_user} = require("../../utils/role_json");
const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const UserModel = require("../../model/user_model");
const Class = require("../../model/class_model");
const RoleModel = require("../../model/role_model");
const UserRoleModel = require("../../model/user_role_model");
const SubjectClassModel = require("../../model/subject_class_model");
const SubjectModel = require("../../model/subject_model");
const UserSemesterModel = require("../../model/user_semester_model");
const SemesterModel = require("../../model/semester_model");

async function addSemesterToUser(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: add_semester_to_user.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }
    const listSemester = req.body;
    console.log(req.body);
    const mUser = await UserModel.findOne({id: req.user.id});
    if (mUser) {
        await UserSemesterModel.deleteMany({idUser: req.user.id});
        listSemester.forEach(async (element) => {
            const mSemesterModel = await SemesterModel.findOne({id: element});
            if (mSemesterModel) {
                const userSemesterModel = new UserSemesterModel({
                    idSemester: element,
                    idUser: req.user.id,
                });
                await userSemesterModel.save();
            } else {
                return res.status(status.success).json(baseJson.baseJson({
                    code: 0,
                    message: 'Không có kì' + element
                }));

            }
        });
        return res.status(status.success).json(baseJson.baseJson({code: 0}));

    } else {
        return res.status(status.success).json(baseJson.baseJson({code: 1, message: 'Không có môn học'}));
    }
}

async function getSemesterOfUser(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: get_all_semester_of_user.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }
    console.log(req.user.id);
    var mUserSemester = await UserSemesterModel.find({idUser: req.user.id});
    if (mUserSemester) {
        var listSemester = [];
        for (var i = 0; i < mUserSemester.length; i++) {
            const mClass = await SemesterModel.findOne({id: mUserSemester[i].idSemester});
            listSemester.push(mClass);
        }
        return res.status(status.success).json(baseJson.baseJson({code: 0, data: listSemester}));
    } else {
        return res.status(status.success).json(baseJson.baseJson({code: 1, message: 'Không có môn học'}));
    }
}

module.exports = {
    addSemesterToUser, getSemesterOfUser
}
