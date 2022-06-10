const express = require("express");
const path = require("path");
const cors = require('cors')
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const app = express();
const config = require("./bin/config/config")
const bodyParser = require('body-parser');

if (config.syncDatabase) {
    require('./src/models/cliente.model')
    require('./src/models/campana.model')
    require('./src/models/frecuencia.model')
    require('./src/models/usuario.model')
}

require("./bin/config/database");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "src/public")));
app.use(bodyParser.json({limit: '10mb'}));
app.use(cors())
app.use("/api/v1", require("./src/routes/index"));


module.exports = app;
