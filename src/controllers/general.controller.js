const config = require('../../bin/config/routes.config')
const databaseFunctionsHelper = require("./helpers/database-functions.helper");
const generalHelper = require("./helpers/general.helper");


const create = (req, res) => {
  
  const objectModel = config.ObjectRoute[req.params.objectroute]
  let bodyReq = JSON.parse(JSON.stringify(req.body));

  if (req.body.length) {
    if (req.params.objectroute === "users") bodyReq = generalHelper.generatePasswordBulk(bodyReq)
    databaseFunctionsHelper.bulk_create(objectModel, bodyReq, res);
  } else {
    if (req.params.objectroute === "users") bodyReq = generalHelper.generatePasswordSingle(bodyReq)
    databaseFunctionsHelper.single_create(objectModel, bodyReq, res);
  }

};

module.exports = {
  create,
};
