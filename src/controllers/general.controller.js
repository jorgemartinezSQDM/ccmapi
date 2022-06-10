const config = require("../../bin/config/routes.config");
const databaseFunctionsHelper = require("./helpers/database-functions.helper");
const generalHelper = require("./helpers/general.helper");

const create = (req, res) => {
  const objectModel = config.ObjectRoute[req.params.objectroute];
  let bodyReq = JSON.parse(JSON.stringify(req.body));
  let continuar = true;
  if (req.params.objectroute === "users") {
    if (
      process.env.SUPERUSER_USERNAME !== req.headers.userName &&
      process.env.SUPERUSER_PASSWORD !== req.headers.password
    ) {
      continuar = false;
    }
  }
  if (continuar) {
    if (req.body.length) {
      if (req.params.objectroute === "users")
        bodyReq = generalHelper.generatePasswordBulk(bodyReq);

      if (req.params.objectroute === "customers")
        bodyReq = generalHelper.generatellaveUnicaClienteBulk(bodyReq);

      databaseFunctionsHelper.bulk_create(objectModel, bodyReq, res);
    } else {
      if (req.params.objectroute === "users")
        bodyReq = generalHelper.generatePasswordSingle(bodyReq);

      if (req.params.objectroute === "customers")
        bodyReq = generalHelper.generatellaveUnicaClienteSingle(bodyReq);

      databaseFunctionsHelper
        .single_create(objectModel, bodyReq)
        .then((response) => {
          const result = response.result;
          const status = response.status;
          res.json(result).status(status);
        });
    }
  } else {
    res.json("Only admin can create users").status(401);
  }
};

const retreive = (req, res) => {
  const objectModel = config.ObjectRoute[req.params.objectroute];
  const attributes = { Id: parseInt(req.params.recordid) };
  databaseFunctionsHelper
    .getByAttributes(objectModel, attributes)
    .then((response) => {
      const result = response.result;
      const status = response.status;
      res.json(result).status(status);
    });
};

const retreiveAll = (req, res) => {
  const objectModel = config.ObjectRoute[req.params.objectroute];

  databaseFunctionsHelper.getAll(objectModel, res);
};

const update = (req, res) => {
  const objectModel = config.ObjectRoute[req.params.objectroute];
  let bodyReq = JSON.parse(JSON.stringify(req.body));
  if (req.body.length) {
    databaseFunctionsHelper.bulk_update(
      objectModel,
      0,
      bodyReq,
      bodyReq.length,
      res
    );
    //*/
  } else {
    const recordId = bodyReq.Id;
    delete bodyReq.Contrasena;
    delete bodyReq.Id;

    databaseFunctionsHelper.updateOne(objectModel, recordId, bodyReq, res);
  }
};
const delete_ = (req, res) => {
  res.json({Message: 'Endpoint no implemented'})
};


module.exports = {
  create,
  delete_,
  update,
  retreive,
  retreiveAll,
};
