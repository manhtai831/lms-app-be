const Department = require("../../model/department_model");
const status = require("../../utils/status");
const baseJson = require("../../utils/base_json");
const {
    getNowFormatted,
    verifyRole,
    convertDateTime,
} = require("../../utils/utils");
const userModel = require("../../model/user_model");
const departmentModel = require("../../model/department_model");
const RepositoryModel = require("../../model/resposity");
const {
    tao_nganh,
    danh_sach_nganh,
    cap_nhat_nganh,
    xoa_nganh,
} = require("../../utils/role_json");
const {baseJsonPage} = require("../../utils/base_json");
const SemesterModel = require("../../model/semester_model");
const {uploadImage} = require("../../utils/image");

async function createDepartment(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: tao_nganh.id,
        userId: req.user.id,
    });
    if(hasRole === false) {
        return res
        .status(status.success)
        .json(
            baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
        );
    }
    const user = await userModel
    .findOne({id: req.user.id})
    .select("id name userName email");
    if(req.body.name == null) {
        return res
        .status(status.success)
        .json(
            baseJson.baseJson({code: 99, message: "Name department is required"})
        );
    }
    var resp;
    if(req.body.data) {
        var a = await uploadImage(req.body.data);
        if(a) {
            resp = a.url;
        }
    }
    const departmentModel = new Department({
        name: req.body.name,
        description: req.body.description,
        idSemester: req.body.idSemester,
        image: resp,
        listRepo: req.body.listRepo,
        status: req.body.status,
        createAt: getNowFormatted(),
        createBy: user,
    });
    
    return departmentModel
    .save()
    .then((newCourse) => {
        return res.status(status.success).json(baseJson.baseJson({code: 0}));
    })
    .catch((error) => {
        console.log(error);
        res.status(status.server_error).json(baseJson.baseJson({code: 99}));
    });
}

async function getAllDepartment(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: danh_sach_nganh.id,
        userId: req.user.id,
    });
    if(hasRole === false) {
        return res
        .status(status.success)
        .json(
            baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
        );
    }
    const index = req.query.pageIndex || 1;
    const size = req.query.pageSize || 50;
    var filter;
    if(req.query.name) {
        filter = {"name": {"$regex": req.query.name, "$options": "i"}}
        // filter = {title :req.query.title}
    }
    if(req.query.idSemester)
        filter = {idSemester: req.query.idSemester};
    var listAllDepartment = await departmentModel.find(filter);
    var listAllRepo = await RepositoryModel.find();
    var listSemester = await SemesterModel.find();
    for(var i = 0; i < listAllDepartment.length; i++) {
        var list = [];
        for(var k = 0; k < listAllDepartment[i].listRepo.length; k++) {
            for(var j = 0; j < listAllRepo.length; j++) {
                
                if(listAllDepartment[i].listRepo[k] === listAllRepo[j].id) {
                    list.push(listAllRepo[j]);
                }
            }
        }
        for(var t = 0; t < listSemester.length; t++) {
            if(listAllDepartment[i].idSemester === listSemester[t].id) {
                listAllDepartment[i].semester = listSemester[t];
            }
        }
        listAllDepartment[i].listRepoObj = list;
    }
    return res.status(status.success).json(
        baseJson.baseJson({
            code: 0,
            data: baseJsonPage(
                Number(index),
                Number(size),
                listAllDepartment.length,
                listAllDepartment
            ),
        })
    );
    
}

async function getAllDepartments(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: danh_sach_nganh.id,
        userId: req.user.id,
    });
    if(hasRole === false) {
        return res
        .status(status.success)
        .json(
            baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
        );
    }
    const index = req.query.pageIndex || 1;
    const size = req.query.pageSize || 50;
    if(req.query.idSemester)
        var filter = {idSemester: req.query.idSemester};
    var listAllDepartment = await departmentModel.find(filter);
    var listAllRepo = await RepositoryModel.find();
    for(var i = 0; i < listAllDepartment.length; i++) {
        var list = [];
        for(var k = 0; k < listAllDepartment[i].listRepo.length; k++) {
            for(var j = 0; j < listAllRepo.length; j++) {
                
                if(listAllDepartment[i].listRepo[k] === listAllRepo[j].id) {
                    list.push(listAllRepo[j]);
                }
            }
        }
        listAllDepartment[i].listRepoObj = list;
    }
    return res.status(status.success).json(
        baseJson.baseJson({
            code: 0,
            data: baseJsonPage(
                Number(index),
                Number(size),
                listAllDepartment.length,
                listAllDepartment
            ),
        })
    );
    
}

async function updateDepartment(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: cap_nhat_nganh.id,
        userId: req.user.id,
    });
    if(hasRole === false) {
        return res
        .status(status.success)
        .json(
            baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
        );
    }
    if(req.body.name == null) {
        return res
        .status(status.success)
        .json(
            baseJson.baseJson({code: 99, message: "Name department is required"})
        );
    }
    
    const user = await userModel
    .findOne({id: req.user.id})
    .select("id name userName email  ");
    var resp;
    if(req.body.data) {
        var a = await uploadImage(req.body.data);
        if(a) {
            resp = a.url;
        }
    }
    return departmentModel
    .updateOne(
        {id: req.body.id},
        {
            $set: {
                updateAt: getNowFormatted(),
                updateBy: user,
                name: req.body.name,
                description: req.body.description,
                idSemester: req.body.idSemester,
                image: resp,
                listRepo: req.body.listRepo,
                status: req.body.status,
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

async function deleteDepartment(req, res) {
    var hasRole = await verifyRole(res, {
        roleId: xoa_nganh.id,
        userId: req.user.id,
    });
    if(hasRole === false) {
        return res
        .status(status.success)
        .json(
            baseJson.baseJson({code: 99, message: "Tài khoản không có quyền"})
        );
    }
    if(req.body.id == null) {
        return res
        .status(status.success)
        .json(
            baseJson.baseJson({code: 99, message: "Id department is required"})
        );
    }
    
    return departmentModel
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
    createDepartment,
    getAllDepartment,
    updateDepartment,
    deleteDepartment,
    getAllDepartments
};
