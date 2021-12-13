// noinspection ES6MissingAwait

const jwt = require("jsonwebtoken");
const userModel = require("../../model/user_model");
const DepartmentModel = require("../../model/department_model");
const SemesterModel = require("../../model/semester_model");
const avatarModel = require("../../model/avatar_model");
const userRoleModel = require("../../model/user_role_model");
const RoleModel = require("../../model/role_model");
// const roleModel = require("../../model/role_model");
const bcrypt = require("bcrypt");
const {baseJson, baseJsonPage} = require("../../utils/base_json");
const UserRoleModel = require("../../model/user_role_model");
const GroupRoleModel = require("../../model/group_role");
const mongoose = require("mongoose");
const fs = require("fs");

async function register(req, res) {
    let encryptedPassword;
    try {
        const {userName, password} = req.body;
        
        if(password== null || userName == null) {
            return res
            .status(200)
            .json(baseJson({code: 99, message: "Yêu cầu tài khoản và mật khẩu"}));
        }
        
        const oldUser = await userModel.findOne({userName: userName});
        
        if(oldUser) {
            return res
            .status(200)
            .json(baseJson({code: 99, message: "Tài khoản đã tồn tại"}));
        }
        
        // encryptedPassword = await bcrypt.hash(password, 10);
        
        var resp;
        if(req.body.data) {
            var a = await uploadImage(req.body.data);
            if(a) {
                resp = a.url;
            }
        }
        const user = userModel({
            name: req.body.name,
            birth: req.body.birth,
            avatar: resp,
            phoneNumber: req.body.phoneNumber,
            gender: req.body.gender,
            address: req.body.address,
            status: req.body.status,
            chuyenNganhId: req.body.chuyenNganhId,
            kiHocId: req.body.kiHocId,
            idGroup: req.body.idGroup,
            permission: [],
            userName: userName,
            email: userName, // sanitize: convert email to lowercase
            password: password,
        });
        
        const token = jwt.sign(
            {user_id: user._id},
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_LIFE,
            }
        );
        
        user.token = token;
        await  user.save();
        return res.status(200).json(
            baseJson({
                code: 0,
            })
        );
        // await user.save().then(async (data) => {
        //     for (var i = 0; i < listRoleDefault.length; i++) {
        //         const userRoleModel = new UserRoleModel({
        //             idUser: data.id,
        //             idRole: listRoleDefault[i],
        //         });
        //         await userRoleModel.save();
        //     }
        //
        // });
        
    } catch(err) {
        console.log(err);
        return res.status(500).json(baseJson({code: 99, data: err}));
    }
}

async function login(req, res) {
    try {
        // Get user input
        const userName = req.body.userName;
        const password = req.body.password;
        // Validate user input
        if(!(userName && password)) {
            res.status(200).json(baseJson({code: 99}));
        }
        
        // Validate if user exist in our database
        const user = await userModel
        .findOne({userName: userName, password: password});
        // .select("id permission name userName email token birth phoneNumber avatar chuyenNganh kiHoc");
        if(req.body.fcmToken) {
            await userModel.updateOne({userName: userName, password: password}, {
                $set: {
                    fcmToken: req.body.fcmToken
                }
            });
        }
        if(user) {
            // Create token
            const token = jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: process.env.ACCESS_TOKEN_LIFE,
            });
            user.token = token;
            if(user.idGroup) {
                var group = await GroupRoleModel.findOne({id: user.idGroup});
                var cn = await DepartmentModel.findOne({id: user.chuyenNganhId}).select(" id name");
                var kh = await SemesterModel.findOne({id: user.kiHocId}).select(" id name");
                if(group)
                    user.nameGroup = group.name;
                
                user.chuyenNganh = cn;
                
                user.kiHoc = kh;
                // console.log(group)
                var roles = [];
                var roleTmp = await RoleModel
                .find()
                .select("id name")
                for(var i = 0; i < group.roles.length; i++) {
                    var role;
                    for(var j = 0; j < roleTmp.length; j++) {
                        if(group.roles[i] === roleTmp[j].id) {
                            role = roleTmp[j];
                            break;
                        }
                    }
                    if(role) {
                        // console.log(role);
                        roles.push(role);
                        
                    }
                    
                }
                user.permission = roles;
            }
            
            return res.status(200).json(baseJson({code: 0, data: user}));
        }
        return res
        .status(200)
        .json(baseJson({code: 99, message: "Sai tài khoản hoặc mật khẩu"}));
    } catch(err) {
        console.log(err);
        return res.status(200).json(baseJson({code: 99, data: err}));
    }
    // Our register logic ends here
}

async function getUserInfo(req, res) {
    try {
        
        var user = await userModel
        .findOne({id: req.user.id})
        .select("id permission name gender userName address email token birth phoneNumber avatar chuyenNganh kiHoc idGroup chuyenNganhId kiHocId");
        if(user) {
            if(user.idGroup) {
                var group = await GroupRoleModel.findOne({id: user.idGroup});
                var cn = await DepartmentModel.findOne({id: user.chuyenNganhId});
                var kh = await SemesterModel.findOne({id: user.kiHocId});
                if(group)
                    user.nameGroup = group.name;
                
                user.chuyenNganh = cn;
                
                user.kiHoc = kh;
                var roles = [];
                var roleTmp = await RoleModel
                .find()
                .select("id name")
                for(var i = 0; i < group.roles.length; i++) {
                    var role;
                    for(var j = 0; j < roleTmp.length; j++) {
                        if(group.roles[i] === roleTmp[j].id) {
                            role = roleTmp[j];
                            break;
                        }
                    }
                    if(role) {
                        // console.log(role);
                        roles.push(role);
                        
                    }
                    
                }
                user.permission = roles;
            }
            // Save the  API response in Redis store,  data expire time in 3600 seconds, it means one hour
            // await client.set('userphotos',  JSON.stringify(user));
            return res.status(200).json(baseJson({code: 0, data: user}));
        }
        return res
        .status(200)
        .json(baseJson({code: 99, message: "Tài khoản chưa được đăng ký"}));
        
        
    } catch(error) {
        return res.status(500).json(baseJson({code: 99, data: error}));
    }
}

async function getListUser(req, res) {
    try {
        
        // console.log(req.user);
        var filter;
        if(req.query.name && req.query.idGroup) {
            filter = {"name": {"$regex": req.query.name, "$options": "i"}, idGroup: req.query.idGroup}
        } else if(req.query.idGroup) {
            filter = {idGroup: req.query.idGroup}
        } else if(req.query.name) {
            filter = {"name": {"$regex": req.query.name, "$options": "i"}}
        }
        var users = await userModel
        .find(filter).select("maSV id name userName password email birth phoneNumber avatar chuyenNganh kiHoc address status gender nameGroup idGroup chuyenNganhId  kiHocId");
        var group = await GroupRoleModel.find();
        var cn = await DepartmentModel.find().select("id name");
        var kh = await SemesterModel.find().select("id name");
        
        for(var i = 0; i < users.length; i++) {
            var g = null;
            var c = null;
            var k = null;
            group.forEach((element) => {
                if(element.id === users[i].idGroup) {
                    g = element;
                }
            })
            cn.forEach((element) => {
                if(element.id === users[i].chuyenNganhId) {
                    c = element;
                }
            })
            kh.forEach((element) => {
                if(element.id === users[i].kiHocId) {
                    k = element;
                }
            })
            
            if(g)
                users[i].nameGroup = g.name;
            
            users[i].chuyenNganh = c;
            
            users[i].kiHoc = k;
        }
        if(users) {
            return res.status(200).json(baseJson({code: 0, data: baseJsonPage(0, 0, users.length, users)}));
        }
        return res
        .status(200)
        .json(baseJson({code: 99}));
    } catch(error) {
        return res.status(500).json(baseJson({code: 99, data: error}));
    }
}

async function deleteUser(req, res) {
    console.log(req.user);
    userModel
    .deleteOne({id: req.body.id})
    .then((result) => {
        return res.status(200).json(baseJson({code: 0, data: {}}));
    })
    .catch((error) => {
        return res.status(500).json(baseJson({code: 99, data: error}));
    });
}

async function updateUser(req, res) {
    var resp;
    if(req.body.data) {
        var a = await uploadImage(req.body.data);
        if(a) {
            resp = a.url;
        }
    } else resp = req.body.avatar
    console.log(resp)
    userModel
    .updateOne({id: req.body.id}, {
        $set: {
            name: req.body.name,
            userName: req.body.userName,
            password: req.body.password,
            email: req.body.email,
            gender: req.body.gender,
            address: req.body.address,
            maSV: req.body.maSV,
            status: req.body.status,
            avatar: resp,
            birth: req.body.birth,
            phoneNumber: req.body.phoneNumber,
            chuyenNganhId: req.body.chuyenNganhId,
            kiHocId: req.body.kiHocId,
            idGroup: req.body.idGroup,
        }
    })
    .then((result) => {
        return res.status(200).json(baseJson({code: 0, data: {}}));
    })
    .catch((error) => {
        return res.status(500).json(baseJson({code: 99, data: error}));
    });
}

async function changePassword(req, res) {
    console.log(req.user);
    var user = await userModel.findOne({id: req.user.id});
    if(user != null) {
        if(req.body.oldPassword === user.password) {
            userModel
            .updateOne(
                {id: req.user.id},
                {$set: {password: req.body.newPassword}}
            )
            .then((result) => {
                return res.status(200).json(baseJson({code: 0}));
            })
            .catch((error) => {
                return res.status(500).json(baseJson({code: 99, data: error}));
            });
        } else {
            return res
            .status(200)
            .json(baseJson({code: 99, message: "Sai mật khẩu cũ"}));
        }
    }
}

async function resetPassword(req, res) {
    
    return userModel
    .updateOne(
        {id: req.body.id},
        {$set: {password: '123@123a'}}
    )
    .then((result) => {
        return res.status(200).json(baseJson({code: 0}));
    })
    .catch((error) => {
        return res.status(500).json(baseJson({code: 99, data: error}));
    });
    
}


const {uploadImage} = require("../../utils/image");
var path = require('path');
const {set} = require("mongoose");
var dir = path.join(__dirname, '../../images');

async function showImage(req, res) {
    try {
        var s1 = '/' + req.query.g;
        var s2 = s1.split('-')[1];
        var file = path.join(dir, s1);
        var s;
        console.log(file);
        if(fs.existsSync(file)) {
            s = await fs.createReadStream(file);
        }
        
        if(s) {
            res.setHeader('content-type', s2.replace('-', '/'))
            return s.pipe(res);
            
        }
        return '';
    } catch(e) {
        console.log(e);
        return '';
    }
    
}


module.exports = {
    register,
    getUserInfo,
    login,
    deleteUser,
    updateUser,
    changePassword, getListUser, resetPassword, showImage
};
