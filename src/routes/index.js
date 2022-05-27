let express = require('express');
let router = express.Router();



router.use('/login', require('./endpoint/login.endpoint'))
/*router.use('/users', require('./endpoint/usuarios.endpoint'))
router.use('/customers', require('./endpoint/clientes.endpoint'))
router.use('/campaigns', require('./endpoint/campanas.endpoint'))
*/
router.use('', require('./endpoint/general.endpoint'))



module.exports = router;