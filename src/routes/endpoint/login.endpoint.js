const express = require("express");
const router = express.Router();
const controller = require('../../controllers/login.controller')
const middleware  = require('../../middleware/index.middleware')

router.post("", middleware.userVerification,controller.login);

module.exports = router;
