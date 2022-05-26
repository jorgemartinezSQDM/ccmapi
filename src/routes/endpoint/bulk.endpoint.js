const express = require("express");
const router = express.Router();
const controller = require('../../controllers/checkLogic.controller')

router.get("/check-logic", controller.index);

module.exports = router;
