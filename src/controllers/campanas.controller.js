const { stringify } = require("querystring");
const Campaign = require("../models/campana.model");
const databaseFunctionsHelper = require("./helpers/database-functions.helper");

const create_campaign = (req, res) => {
  
  let bodyReq = JSON.parse(JSON.stringify(req.body));

  if (req.body.length) {

    databaseFunctionsHelper.bulk_create(Campaign, bodyReq, res);
  } else {

    databaseFunctionsHelper.single_create(Campaign, bodyReq, res);
  }
};

module.exports = {
  create_campaign,
};
