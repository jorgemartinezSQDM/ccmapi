let express = require('express');
let router = express.Router();



router.use('/login', require('./endpoint/login.endpoint'))
router.use('/logic', require('./endpoint/logic.endpoint'))
router.use('', require('./endpoint/general.endpoint'))



module.exports = router;