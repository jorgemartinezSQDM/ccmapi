let express = require('express');
let router = express.Router();


router.use('/bulk', require('./endpoint/bulk.endpoint'))
router.use('/users', require('./endpoint/usuarios.endpoint'))
router.use('/login', require('./endpoint/login.endpoint'))



module.exports = router;