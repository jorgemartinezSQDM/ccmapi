const User = require("../../src/models/usuario.model");
const Campaign = require("../../src/models/campana.model");
const Customer = require("../../src/models/cliente.model");

const ObjectRoute = {
  users: User,
  customers: Customer,
  campaigns: Campaign,
};

module.exports = {
  ObjectRoute,
};
