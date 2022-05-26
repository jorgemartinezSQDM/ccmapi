const express = require("express");
const router = express.Router();
const controller = require('../../controllers/users.controller')
const middleware =  require("../../middleware/index.middleware")

router.post("/create-user", middleware.tokenVerification, controller.create_user);

module.exports = router;
