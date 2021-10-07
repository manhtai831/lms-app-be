const jwt = require('jsonwebtoken');
const userModel = require('../model/user_model');
const bcrypt = require('bcrypt');
const {baseJson} = require("../utils/base_json");
const verifyToken = require("../middleware/auth_controller");
const Course = require('../model/tetst_model')

async function register(req, res) {
    let encryptedPassword;
    try {
        const {name, userName, password, email} = req.body;

        if (!(email && password && name && userName)) {
            res.status(400).send("All input is required");
        }

        const oldUser = await userModel.findOne({userName: userName});

        if (oldUser) {
            return res.status(409).json(baseJson({code: 99, message: 'Tài khoản đã tồn tại'}));
        }


        encryptedPassword = await bcrypt.hash(password, 10);

        const user = userModel({
            name: name,
            userName: userName,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });


        const token = jwt.sign(
            {user_id: user._id},
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_LIFE,
            }
        );

        user.token = token;
        await user.save().then((newUser) => {
            res.status(200).json(baseJson({
                    code: 0, message: 'Success'
                }
            ));
        });


    } catch (err) {
        console.log(err);
        res.status(500).json(baseJson(
            {code: 99, data: err}
        ));
    }
}

async function login(req, res) {

    try {
        // Get user input
        const {userName, password} = req.body;

        // Validate user input
        if (!(userName && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await userModel.findOne({userName}).select('id name userName password email token');

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                {id: user.id},
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: process.env.ACCESS_TOKEN_LIFE,
                }
            );

            // save user token
            user.token = token;
            // user.testModel = Course({
            //     id: 1,
            //     title: 'dddddddd',
            //     description: 'aaaaaaaaaaaaa'
            // });
            // user
            res.status(200).json(baseJson({code: 0, data: user}));
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
}

async function getUserInfo(req, res) {
    console.log(req.user);
    userModel.findOne({id:req.user.id})
        .select('id name userName password email')
        .then((result) => {
        return res.status(200).json(baseJson({code:0,data:result}));
    }).catch((error) =>{
        return res.status(500).json(baseJson({code:99,data:error}));
    })
}

module.exports = {
    register, getUserInfo, login
}