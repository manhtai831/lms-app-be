

const {baseJson} = require("../../utils/base_json");
const UserRoleModel = require('../../model/quyen/user_role_model')
const RoleModel = require('../../model/quyen/role_model')
const status = require("../../utils/status");

 async function addRoleToAccount(req, res) {
     try{
         const listRole = req.body;
         console.log(req.body);
         listRole.forEach(async (element)=>{
             const  role = RoleModel.findOne({id:element});
             if(role){
                 const userRoleModel = new UserRoleModel({
                     idUser: req.user.id,
                     idRole:element,
                     name:role.name
                 });
                 await UserRoleModel.findOneAndRemove({idRole : element});
                 await  userRoleModel.save();
             }
         })
         return res.status(status.success).json(baseJson({code:0}));
     }catch (error) {
         console.log(error);
         return res.status(status.server_error).json(baseJson({code: 99, message : error}));

     }
}

module.exports = {addRoleToAccount}