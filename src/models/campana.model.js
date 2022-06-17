const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../../bin/config/database");
const frecuencia = require("./frecuencia.model")

const Campana = sequelize.define("Campana", {
  Nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ExternalId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  numeroVecesClientesDia: {
    type: DataTypes.INTEGER
  }
});

Campana.hasMany(frecuencia, {
  foreignKey: 'CampanaId',
  sourceKey: 'Id',
  allowNull: false
})
frecuencia.belongsTo(Campana, {
  foreignKey: 'CampanaId',
  targetKey: 'Id',
  allowNull: false
})

module.exports = Campana
  