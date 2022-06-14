const express = require("express");
const router = express.Router();
const controller = require('../../controllers/general.controller')
const middleware =  require("../../middleware/index.middleware")

router.get("/:objectroute/retrieve", middleware.tokenVerification, controller.retreiveAll);
router.get("/:objectroute/:recordid/retrieve", middleware.tokenVerification, controller.retreive);
router.post("/:objectroute/create", middleware.tokenVerification, controller.create);
router.put("/:objectroute/update", middleware.tokenVerification, controller.update);
router.delete("/:objectroute/delete", middleware.tokenVerification, controller.delete_);


module.exports = router;
