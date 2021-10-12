const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const logger = require("morgan");
const userRoutes = require("./src/api/user/route");
const departmentRoutes = require("./src/api/department/route");
const status = require("./src/utils/status");
const dotenv = require("dotenv");
const express = require("express");

// get config vars
dotenv.config();

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("dev"));

var db = process.env.URI_DB_DEV || process.env.URI_DB_PRODUCT;
mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
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

app.use("/api/", departmentRoutes, userRoutes);

app.listen(app.get("port"), function () {
	console.log("Listening on port " + app.get("port"));
	console.log(db);
});
