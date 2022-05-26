const express = require("express");
const router = express.Router();
const controller = require('../../controllers/campanas.controller')
const middleware =  require("../../middleware/index.middleware")

router.post("/create-campaign", middleware.tokenVerification, controller.create_campaign);

module.exports = router;
