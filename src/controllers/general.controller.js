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
          res.status(status).json(result);
        });
    }
  } else {
    res.status(401).json("Only admin can create users");
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
      res.status(status).json(result);
    });
};

const retreiveAll = (req, res) => {
  const objectModel = config.ObjectRoute[req.params.objectroute];
  const page = req.query.page ? parseInt(req.query.page) - 1 : 0;
  const size = req.query.size ? parseInt(req.query.size) : 20;

  let params = JSON.parse(JSON.stringify(req.query));
  delete params.page;
  delete params.size;


  if (req.params.objectroute == "frecuencies") {

    console.log("params => ", params);
    let query = ''
    Object.keys(params).map((item) => {
      /*console.log(
        "(params[item]).toLowerCase().trim() => ",
        params[item].toLowerCase().trim()
      );
      

      const value = params[item];
      console.log("/[a-zA-Z]/.test(value) => ", /[a-zA-Z]/.test(value));
      const namefield = objectModel.tableAttributes[item].type.constructor.key;

      if (namefield === "INTEGER" && !/[a-zA-Z]/.test(value)) {
        params[item] = parseInt(params[item]);
      }*/
    
      if(item === 'campanaId') query += '"campanas"."Id" = ' + parseInt(params[item]) + ' AND '

      if(item === 'clienteId') query += '"clientes"."Id" = ' + parseInt(params[item]) + ' AND '
    
    
    });
    query = query.substring(0, query.length - 5);
    
    databaseFunctionsHelper.rawQuery(res, query);
  } else {
    databaseFunctionsHelper.getAll(objectModel, res, page, size, params);
  }
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
  const objectModel = config.ObjectRoute[req.params.objectroute];
  let bodyReq = JSON.parse(JSON.stringify(req.body));
  let attributes = { Id: bodyReq.records };

  databaseFunctionsHelper.deleteById(objectModel, attributes, res);
};

module.exports = {
  create,
  delete_,
  update,
  retreive,
  retreiveAll,
};
