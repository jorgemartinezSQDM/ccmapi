const express = require("express");
const activity = require("../../controllers/activity.controller")
const router = express.Router();

router.post('/save', activity.save);
router.post('/validate', activity.validate);
router.post('/publish', activity.publish);
router.post('/execute', activity.execute);
router.post('/stop', activity.stop);
router.post('/edit', activity.edit);
router.post('/logs', activity.edit);

module.exports = router;



