const express = require("express");
const path = require("path");
const cors = require('cors')
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const app = express();
const config = require("./bin/config/config")
const bodyParser = require('body-parser');
const session = require('express-session');

if (config.syncDatabase) {
    require('./src/models/cliente.model')
    require('./src/models/campana.model')
    require('./src/models/frecuencia.model')
    require('./src/models/usuario.model')
}

require("./bin/config/database");
 
app.use(logger("dev"));
app.use(bodyParser.json({ type: 'application/json', limit: '50mb', extended: true }));
app.use(express.json({limit: process.env.LIMIT_SIZE_JSON}));
app.use(express.urlencoded({ extended: false, limit: process.env.LIMIT_SIZE_URLENCODE }));
app.use(cookieParser());
app.use(bodyParser.raw({ type: 'application/jwt' }));
app.use(session({
    secret: 'Jb9j@pS~gkA]v^$za5Us@V]vvzBqR{',
    unset: 'destroy',
    proxy: true,
    cookie: {
        sameSite: 'none',
        secure: true,
    },
    saveUninitialized: true,
    resave: true
}));
app.use(express.static(path.join(__dirname, "src/public")));
app.use(cors())
app.use("/api/v1", require("./src/routes/index"));
app.use(require("./src/routes/endpoint/activity.routes"));

 
module.exports = app;
