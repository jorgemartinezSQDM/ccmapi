const { stringify } = require("querystring");
const Customer = require("../models/cliente.model");
const databaseFunctionsHelper = require("./helpers/database-functions.helper");

const create_customer = (req, res) => {
  
  let bodyReq = JSON.parse(JSON.stringify(req.body));

  if (req.body.length) {

    databaseFunctionsHelper.bulk_create(Customer, bodyReq, res);
  } else {

    databaseFunctionsHelper.single_create(Customer, bodyReq, res);
  }
};

module.exports = {
  create_customer,
};
