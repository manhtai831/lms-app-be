const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const ReposityModel = require("../../model/resposity");
const DepartmentModel = require("../../model/department_model");
const ReposityDepartmentModel = require("../../model/repo_department");
const {
    getNowFormatted,
    verifyRole,
    convertDateTime
} = require("../../utils/utils");

const userModel = require("../../model/user_model");
const Class = require("../../model/class_model");
const {
    create_class,
    get_all_class,
    update_class,
    delete_class,
    register_class,
    get_reposity,
    create_reposity,
} = require("../../utils/role_json");
const {baseJsonPage} = require("../../utils/base_json");
const {uploadImage} = require("../../utils/image");


async function createRespoDepartment(req, res) {
    // var hasRole = await verifyRole(res, {
    //     roleId: get_reposity.id,
    //     userId: req.user.id,
    // });
    // if (hasRole === false) {
    //     return res
    //         .status(status.success)
    //         .json(
    //             baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
    //         );
    // }
    
    var repoDepart = await ReposityDepartmentModel({
        idRepo: req.body.idRepo,
        idDepartment: req.body.idDepartment
    })
    return repoDepart
    .save()
    .then((newData) => {
        return res.status(status.success).json(baseJson.baseJson({code: 0}));
    })
    .catch((error) => {
        console.log(error);
        res.status(status.server_error).json(baseJson.baseJson({code: 99}));
    });
}


async function getRepoDepartment(req, res) {
    // var hasRole = await verifyRole(res, {
    //     roleId: create_reposity.id,
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
    var listRD = [];
    if(req.query.idDepartment) {
        // filter = {"title": {"$regex": req.query.title, "$options": "i"}}
        filter = {idDepartment: req.query.idDepartment};
        listRD = await ReposityDepartmentModel.find(filter);
        var listR = await ReposityModel.find();
        
        for(var i = 0; i < listRD.length; i++) {
            for(var j = 0; j < listR.length; j++) {
                if(listRD[i].idRepo === listR[j].id) {
                    listRD[i].repo = listR[j];
                }
            }
        }
    }
    
    if(req.query.idRepo){
        filter = {idRepo: req.query.idRepo};
        listRD = await ReposityDepartmentModel.find(filter);
        var listD = await DepartmentModel.find();
    
        for(var i = 0; i < listRD.length; i++) {
            for(var j = 0; j < listD.length; j++) {
                if(listRD[i].idDepartment === listD[j].id) {
                    listRD[i].department = listD[j];
                }
            }
        }
    }
   
    return res.status(status.success).json(
        baseJson.baseJson({
            code: 0,
            data: baseJsonPage(0, 0, listRD.length, listRD)
        }));
    
}

async function updateRepoDepartment(req, res) {
    /* var hasRole = await verifyRole(res, {
     roleId: update_class.id,
     userId: req.user.id,
     });
     if (hasRole === false) {
     return res
     .status(status.success)
     .json(
     baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
     );
     }*/
    if(req.body.id == null) {
        return res
        .status(status.success)
        .json(
            baseJson.baseJson({code: 99, message: "ID is required"})
        );
    }
    
    // const user = await userModel
    // .findOne({id: req.user.id})
    // .select(" name ");
    // var resp;
    // if(req.body.data) {
    //     var a = await uploadImage(req.body.data);
    //     if(a) {
    //         resp = a.url;
    //     }
    // }
    return ReposityDepartmentModel
    .updateOne(
        {id: req.body.id},
        {
            $set: {
                idRepo: req.body.idRepo,
                idDepartment: req.body.idDepartment
            },
        }
    )
    .then(() => {
        return res.status(status.success).json(baseJson.baseJson({code: 0}));
    })
    .catch((error) => {
        console.log(error);
        res.status(status.server_error).json(baseJson.baseJson({code: 99}));
    });
}

async function deleteRepoDepartment(req, res) {
    /*ar hasRole = await verifyRole(res, {
     roleId: delete_class.id,
     userId: req.user.id,
     });
     if (hasRole === false) {
     return res
     .status(status.success)
     .json(
     baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
     );
     }*/
    if(req.body.id == null) {
        return res
        .status(status.success)
        .json(
            baseJson.baseJson({code: 99, message: "Id is required"})
        );
    }
    
    return ReposityDepartmentModel
    .deleteOne({id: req.body.id})
    .then(() => {
        return res.status(status.success).json(baseJson.baseJson({code: 0}));
    })
    .catch((error) => {
        console.log(error);
        res.status(status.server_error).json(baseJson.baseJson({code: 99}));
    });
}

module.exports = {
    createRespoDepartment,
    getRepoDepartment,
    updateRepoDepartment,
    deleteRepoDepartment
    
};
