let express = require('express');
let router = express.Router();


router.use('/bulk', require('./endpoint/bulk.endpoint'))



module.exports = router;