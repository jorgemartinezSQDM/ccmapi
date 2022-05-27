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

module.exports = {
  encryptPassword,
  comparePassword,
  generatePasswordBulk,
  generatePasswordSingle,
};
