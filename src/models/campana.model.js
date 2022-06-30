const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../../bin/config/database");
const frecuencia = require("./frecuencia.model");

const Campana = sequelize.define("campana", {
  Nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      customValidator(value) {
        if (/^\s*$/.test(value)) {
          throw new Error("campana.Nombre cannot be empty");
        }
      },
    },
  },
  ExternalId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      customValidator(value) {
        if (/^\s*$/.test(value)) {
          throw new Error("campana.ExternalId cannot be empty");
        }
      },
    },
  },
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  numeroVecesClientesDia: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1 
  },
});

Campana.hasMany(frecuencia, {
  foreignKey: "CampanaId",
  sourceKey: "Id",
  allowNull: false,
});
frecuencia.belongsTo(Campana, {
  foreignKey: "CampanaId",
  targetKey: "Id",
  allowNull: false,
});

module.exports = Campana;
