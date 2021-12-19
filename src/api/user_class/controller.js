const {verifyRole} = require("../../utils/utils");
const {register_class} = require("../../utils/role_json");
const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const UserClassModel = require("../../model/user_class_model");
const Class = require("../../model/class_model");
const userModel = require("../../model/user_model");
const SubjectModel = require("../../model/subject_model");
const {baseJsonPage} = require("../../utils/base_json");


async function registerClass(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: register_class.id,
        userId: req.user.id,
    });
    if(hasRole === false) {
        return res
        .status(status.success)
        .json(
            baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
        );
    }
    // var availableClass = await Class.findOne({id: req.body.idClass});
    // if(availableClass === null) {
    //     return res
    //     .status(status.success)
    //     .json(
    //         baseJson.baseJson({code: 99, message: "Lớp không tồn tại"})
    //     );
    // }
    console.log(req.user.id)
    var availableClass1 = await UserClassModel.findOne({idUser: req.user.id, idClass: req.body.idClass});
    if(availableClass1 == null) {
        var userClassModel = new UserClassModel({
            idUser: req.user.id,
            idClass: req.body.idClass
        });
        return userClassModel.save()
        .then((data) => {
            return res.status(status.success).json(baseJson.baseJson({code: 0}));
        })
        .catch((error) => {
            console.log(error);
            return res
            .status(status.server_error)
            .json(baseJson.baseJson({code: 99, message: error}));
        });
    } else {
        return res
        .status(status.server_error)
        .json(baseJson.baseJson({code: 1, message: 'Đã đăng ký'}));
    }
    
}

async function getRegisteredClass(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: register_class.id,
        userId: req.user.id,
    });
    if(hasRole === false) {
        return res
        .status(status.success)
        .json(
            baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
        );
    }
    
    var availableClass = await UserClassModel.find({idUser: req.user.id});
    var listClass = await Class.find();
    var listClassRegister = [];
    for(var i = 0; i < availableClass.length; i++) {
        for(var j = 0; j < listClass.length; j++) {
            if(availableClass[i].idClass === listClass[j].id) {
                listClassRegister.push(listClass[j]);
            }
        }
    }
    return res.status(status.success).json(baseJson.baseJson({
        code: 0,
        data: baseJsonPage(0, 0, listClassRegister.length, listClassRegister)
    }));
    
    
}

async function getSubjectRegisteredClass(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: register_class.id,
        userId: req.user.id,
    });
    if(hasRole === false) {
        return res
        .status(status.success)
        .json(
            baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
        );
    }
    
    var availableClass = await UserClassModel.find({idUser: req.user.id});
    var listClass = await Class.find();
    var subjectList = await SubjectModel.find();
    var listClassRegister = [];
    for(var i = 0; i < availableClass.length; i++) {
        for(var j = 0; j < listClass.length; j++) {
            if(availableClass[i].idClass === listClass[j].id) {
                listClassRegister.push(listClass[j]);
            }
        }
    }
    console.log(listClassRegister)
    
    var listSubjectRegister = [];  for(var j = 0; j< subjectList.length;j++){
    for(var i =0; i< listClassRegister.length;i++){
      
            if(listClassRegister[i].idSubject === subjectList[j].id){
                listSubjectRegister.push(subjectList[j]);
                break;
            }
     
    }   }
    return res.status(status.success).json(baseJson.baseJson({
        code: 0,
        data: baseJsonPage(0, 0, listSubjectRegister.length, listSubjectRegister)
    }));
    
    
}

async function getUserOfClass(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: register_class.id,
        userId: req.user.id,
    });
    if(hasRole === false) {
        return res
        .status(status.success)
        .json(
            baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
        );
    }
    
    // if (availableClass != null) {
    await UserClassModel
    .find({idClass: req.query.idClass}).select()
    .then(async(result) => {
        for(var i = 0; i < result.length; i++) {
            11
            result[i].user = await userModel.findOne({id: result[i].idUser}).select("name email phoneNumber userName birth avatar address chuyenNganh kiHoc gender idGroup")
        }
        
        return res.status(status.success).json(baseJson.baseJson({
            code: 0,
            data: baseJsonPage(0, 0, result.length, result)
        }));
    })
    .catch((error) => {
        console.log(error);
        return res.status(status.success).json(baseJson.baseJson({code: 99, data: error}));
    });
    // } else {
    //     return res.status(status.success).json(baseJson.baseJson({code: 1, message: 'Lớp chưa được đăng ký'}));
    // }
}

async function cancelRegisteredClass(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: register_class.id,
        userId: req.user.id,
    });
    if(hasRole === false) {
        return res
        .status(status.success)
        .json(
            baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
        );
    }
    
    var availableClass = await UserClassModel.findOne({idUser: req.user.id, idClass: req.body.idClass});
    if(availableClass) {
        await UserClassModel
        .findOneAndRemove({idUser: req.user.id, idClass: req.body.idClass})
        .then((result) => {
            return res.status(status.success).json(baseJson.baseJson({code: 0}));
        })
        .catch((error) => {
            console.log(error);
            return res.status(status.success).json(baseJson.baseJson({code: 0, data: error}));
        });
    } else {
        return res.status(status.success).json(baseJson.baseJson({code: 1, message: 'Lớp chưa được đăng ký'}));
    }
    
}


async function checkRegisterClass(req, res) {
    var availableClass = await UserClassModel.findOne({idUser: req.user.id, idClass: req.body.idClass});
    if(availableClass) {
        return res.status(status.success).json(baseJson.baseJson({code: 0, message: 'Lớp đã được đăng ký'}));
    } else {
        return res.status(status.success).json(baseJson.baseJson({code: 15, message: 'Lớp chưa được đăng ký'}));
    }
}


module.exports = {
    registerClass,
    getRegisteredClass, getUserOfClass,checkRegisterClass,getSubjectRegisteredClass,
    cancelRegisteredClass
};
