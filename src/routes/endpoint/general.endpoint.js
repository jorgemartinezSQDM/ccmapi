const express = require("express");
const router = express.Router();
const controller = require('../../controllers/general.controller')
const middleware =  require("../../middleware/index.middleware")

router.post("/:objectroute/create", middleware.tokenVerification, controller.create);

module.exports = router;
