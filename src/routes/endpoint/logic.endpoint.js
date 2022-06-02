const express = require("express");
const router = express.Router();
const controller = require('../../controllers/logic.controller')
const middleware =  require("../../middleware/index.middleware")

router.post("/index-logic", middleware.tokenVerification, controller.index_logic);


module.exports = router;
