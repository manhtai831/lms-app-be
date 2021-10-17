const {verifyRole, getNowFormatted} = require("../../utils/utils");
const {
    create_class,
    add_class_to_subject,
    add_class_of_subject,
    add_a_class_to_a_subject, delete_a_class_in_a_subject, create_document, add_type_document_to_a_subject,
    get_all_type_document_by_subject
} = require("../../utils/role_json");
const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const userModel = require("../../model/user_model");
const Class = require("../../model/class_model");
const RoleModel = require("../../model/role_model");
const UserRoleModel = require("../../model/user_role_model");
const SubjectTypeDocument = require("../../model/subject_type_document_model");
const SubjectClassModel = require("../../model/subject_class_model");
const SubjectModel = require("../../model/subject_model");
const {createClass} = require("../class/controller");
const Document = require("../../model/document_model");

async function addATDocumentToASubject(req, res) {
    //Tạo mới Type document
    var hasRoleTDocument= await verifyRole(res, {
        roleId: create_document.id,
        userId: req.user.id,
    });
    var hasRole = await verifyRole(res, {
        roleId: add_type_document_to_a_subject.id,
        userId: req.user.id,
    });
    if (hasRole === false || hasRoleTDocument === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }

    const DocumentModel = new Document({
        title: req.body.title,
        content: req.body.content,
        description: req.body.description,
        createdAt: getNowFormatted(),
        createdBy: req.user.id,
    });

    const mSubject = await SubjectModel.findOne({id: req.body.idSubject});

    if (mSubject) {
        return DocumentModel
            .save()
            .then(async (result) => {
                const subjectTypeDocument = new SubjectTypeDocument({
                    idTypeDocument: result.id,
                    idSubject: req.body.idSubject,
                });
                await subjectTypeDocument.save();
                return res.status(status.success).json(baseJson.baseJson({
                    code: 0,
                    message: 'Thêm loại tài liệu thành công'
                }));
            })
            .catch((error) => {
                console.log(error);
                return res.status(status.server_error).json(baseJson.baseJson({
                    code: 99,
                    message: 'Tạo mới loại tài liệu không thành công'
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
    if (hasRole === false ) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
            );
    }

    const mSubject = await SubjectModel.findOne({id: req.query.idSubject});
    const mClass = await Class.findOne({id: req.query.idClass});

    if (mSubject && mClass) {
        return SubjectClassModel.findOneAndRemove({idSubject:mSubject.id,idClass:mClass.id})
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
        return res.status(status.server_error).json(baseJson.baseJson({code: 99, message: 'Môn học hoặc lớp học không tồn tại'}));

    }

}

async function getTypeDocumentOfSubject(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: get_all_type_document_by_subject.id,
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
    var mSubject = await SubjectTypeDocument.find({idSubject: req.query.idSubject});
    if (mSubject) {
        var listTypeDocument = [];
        for (var i = 0; i < mSubject.length; i++) {
            const mTypeDocument = await SubjectModel.findOne({id: mSubject[i].idTypeDocument});
            listTypeDocument.push(mTypeDocument);
        }
        return res.status(status.success).json(baseJson.baseJson({code: 0, data: listTypeDocument}));
    } else {
        return res.status(status.success).json(baseJson.baseJson({code: 1, message: 'Không có môn học'}));
    }
}

module.exports = {
    addATDocumentToASubject,getTypeDocumentOfSubject
}
