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
const Class = require("../../model/class_model");
const SubjectTypeDocument = require("../../model/subject_type_document_model");
const SubjectClassModel = require("../../model/subject_class_model");
const SubjectModel = require("../../model/subject_model");
const DocumentTypeModel = require("../../model/document_type_model");


///Thêm 1 danh mục vào trong môn học
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
///tạo 1 tài liệu
    const DocumentTypeModel = new DocumentTypeModel({
        title: req.body.title,
        name: req.body.name,
        createdAt: getNowFormatted(),
        createdBy: req.user.id,
    });

    ///Tìm môn học
    const mSubject = await SubjectModel.findOne({id: req.body.idSubject});

    if (mSubject) {
        return DocumentTypeModel
            .save()
            .then(async (result) => {
                ///lưu danh mục đó vào môn học
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
async function getAllTypeDocument(req, res) {
    return DocumentTypeModel.find().then((result)=>{
        return res.status(status.success).json(baseJson.baseJson({
            code: 0,
            data: result
        }));
    });
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

///lấy các danh mục trong 1 môn học
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
    console.log(req.query.libraryZone);
    ///Tìm môn học
    var mSubject = await SubjectTypeDocument.find({idSubject: req.query.idSubject});
    ///Xác định kiểu truy cập
    const libraryZone= req.query.libraryZone;
    if(libraryZone === 'KHO_HOC_LIEU'){
        if (mSubject) {
            var listTypeDocument = [];
            for (var i = 0; i < mSubject.length; i++) {
                const mTypeDocument = await SubjectModel.findOne({id: mSubject[i].idTypeDocument});
                listTypeDocument.push(mTypeDocument);
            }
            return res.status(status.success).json(baseJson.baseJson({code: 0, data: listTypeDocument}));
        }
    }
   else {
        return res.status(status.success).json(baseJson.baseJson({code: 1, message: 'Không có môn học'}));
    }
}

module.exports = {
    addATDocumentToASubject,getTypeDocumentOfSubject,getAllTypeDocument
}
