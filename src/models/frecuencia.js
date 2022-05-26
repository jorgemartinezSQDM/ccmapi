const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../../bin/config/database");

const frecuencia = sequelize.define("frecuencia", {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }
});

module.exports = frecuencia
