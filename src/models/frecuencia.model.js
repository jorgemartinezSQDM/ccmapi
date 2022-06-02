const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../../bin/config/database");

const frecuencia = sequelize.define("frecuencia", {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ClienteId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  CampanaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }, 
  ToquesDia: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = frecuencia
