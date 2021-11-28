const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const logger = require("morgan");
const userRoutes = require("./src/api/user/route");
const departmentRoutes = require("./src/api/department/route");
const classRoutes = require("./src/api/class/route");
const userClassRoutes = require("./src/api/user_class/route");
const userSemesterRoutes = require("./src/api/user_semester/route");
const semesterRoutes = require("./src/api/semester/route");
const subjectClassRoutes = require("./src/api/subject_class/route");
const subjectTypeDocumentRoutes = require("./src/api/subject_type_document/route");
const subjectRoutes = require("./src/api/subject/route");
const documentTypeRoutes = require("./src/api/document_type/route");
const documentRoutes = require("./src/api/document/route");
const assigmentRoutes = require("./src/api/assignment/route");
const labRoutes = require("./src/api/lab/route");
const answerRoutes = require("./src/api/answer/route");
const rolesRoutes = require("./src/api/group_role/route");
const questionRouter = require("./src/api/question/route");
const fileAttachRouter = require("./src/api/file_attach/route");
const fileSystemRouter = require("./src/api/file_system/file_system_route");
const danhMucRouter = require("./src/api/danh_muc_lon/danh_muc_lon_route");
const quizRouter = require("./src/api/quiz/quiz_route");
const groupTypeRouter = require("./src/api/group_type/group_type_route");
const quizDoc = require("./src/api/quiz_document/quiz_doc_route");
const repoDepartRoute = require("./src/api/repo_department/repo_department_route");
const infoQuizRoute = require("./src/api/info_quiz/info_quiz_route");
const status = require("./src/utils/status");
const dotenv = require("dotenv");
const express = require("express");
const cors = require('cors');
const fetch = require("node-fetch");
const redis = require("redis");
const cachegoose = require('cachegoose');
const {getMoreFormatted,afterNow} = require("./src/utils/utils");
// get config vars
dotenv.config();

const app = express();
app.use(cors());


app.set("port", process.env.PORT || 3002);


cachegoose(mongoose, {
    port: 6379,         /* the query results will be cached in memory. */
    host: 'localhost'
});


app.use(bodyParser.json({limit: '25mb'}));
// app.use(express.json({limit: '25mb'}));
app.use(bodyParser.urlencoded({extended: false,limit: '25mb' }));
app.use(logger("dev"));

var db = process.env.URI_DB_DEV || process.env.URI_DB_PRODUCT;
mongoose
    .connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("Database connected");
    })
    .catch((error) => {
        console.log(error);
        console.log("Error connecting to database");
    });

app.get("/", function (req, res) {
    if (!res.headersSent) {
        res.status(status.success).json({
            message: "TECH NFD API RESTFUL",
        });
    }
    res.end();
});

app.use(
    "/api",
    departmentRoutes,
    userRoutes,
    subjectRoutes,
    documentTypeRoutes,
    documentRoutes,
    classRoutes,
    userClassRoutes,
    subjectClassRoutes,
    userSemesterRoutes,
    subjectTypeDocumentRoutes,
    semesterRoutes,
    assigmentRoutes,
    labRoutes,
    answerRoutes,
    questionRouter,
    fileAttachRouter,
    danhMucRouter,repoDepartRoute,
    quizRouter, rolesRoutes, groupTypeRouter,fileSystemRouter,quizDoc,infoQuizRoute
);
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin',  '*');
    next();
});

app.listen(app.get("port"), function () {
    // console.log(Date.now());
    console.log("Listening on port " + app.get("port"));
    console.log(db);
    // console.log(getMoreFormatted(15));
    console.log(afterNow("2021/11/28 17:45:49"));
});

