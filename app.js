const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const app = express();

//require('./src/models/cliente')
//require('./src/models/campana')
//require('./src/models/frecuencia')
require("./bin/config/database");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "src/public")));

app.use("/api/v1", require("./src/routes/index"));


module.exports = app;
