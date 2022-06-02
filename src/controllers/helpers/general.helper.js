const bcrypt = require("bcrypt");

const encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const comparePassword = function (password, savedPassword) {
  return bcrypt.compareSync(password, savedPassword);
};

const generatePasswordBulk = (bodyReq) => {
  return bodyReq.map((result) => {
    result.Contrasena = encryptPassword(result.Contrasena);
    return result;
  });
};

const generatePasswordSingle = (bodyReq) => {
  bodyReq.Contrasena = encryptPassword(bodyReq.Contrasena);
  return bodyReq;
};

const deletePasswordFromResponse = (results) => {
  if (results.length) {
    results = JSON.parse(JSON.stringify(results));
    results = results.map((result) => {
      if (result.Tipo_Documento) {
        result.llaveUnicaCliente = result.Tipo_Documento + result.Numero_Documento;
      }
      delete result.Contrasena;
      return result;
    });
  } else {
    results = JSON.parse(JSON.stringify(results));
    delete results.Contrasena;
  }
  return results;
};

module.exports = {
  encryptPassword,
  comparePassword,
  generatePasswordBulk,
  generatePasswordSingle,
  deletePasswordFromResponse,
};
