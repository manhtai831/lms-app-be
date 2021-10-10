const jwt = require("jsonwebtoken");
const {baseJson} = require("../utils/base_json");
const userModel = require('../model/tai_khoan/user_model');
const userRoleModel = require('../model/quyen/user_role_model');

const config = process.env;

const verifyToken = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["token"];

    if (!token) {
        return res.status(403).json(baseJson({code: 99, message: "A token is required for authentication"}));
    }
    try {
        const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        // console.log(req.user);
    } catch (err) {
        return res.status(401).json(baseJson({code: 98, message: "Fiboden"}));
    }
    return next();
};


module.exports = verifyToken;