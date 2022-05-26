const express = require("express");
const router = express.Router();
const controller = require('../../controllers/clientes.controller')
const middleware =  require("../../middleware/index.middleware")

router.post("/create-customer", middleware.tokenVerification, controller.create_customer);

module.exports = router;
