const { stringify } = require("querystring");
const User = require("../models/usuario.model");
const databaseFunctionsHelper = require("./helpers/database-functions.helper");
const userHelper = require("./helpers/user.helper");

const create_user = (req, res) => {
  if (
    process.env.SUPERUSER_USERNAME !== req.headers.userName &&
    process.env.SUPERUSER_PASSWORD !== req.headers.password
  ) {
      
    return res.json("Only admin can create users").status(401)
  }

  let bodyReq = JSON.parse(JSON.stringify(req.body));

  if (req.body.length) {
    bodyReq = bodyReq.map((result) => {
      result.Contrasena = userHelper.encryptPassword(result.Contrasena);
      return result;
    });

    databaseFunctionsHelper.bulk_create(User, bodyReq, res);
  } else {
    bodyReq.Contrasena = userHelper.encryptPassword(bodyReq.Contrasena);

    databaseFunctionsHelper.single_create(User, bodyReq, res);
  }
};

module.exports = {
  create_user,
};
