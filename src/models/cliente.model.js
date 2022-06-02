const { DataTypes} = require("sequelize");
const sequelize = require("../../bin/config/database");
const frecuencia = require("./frecuencia.model")

const Cliente = sequelize.define("Cliente", {
  Nombres: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Apellidos: {
    type: DataTypes.STRING,
  },
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Tipo_Documento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Numero_Documento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  llaveUnicaCliente: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  }
});

Cliente.hasMany(frecuencia, {
  foreignKey: 'ClienteId',
  sourceKey: 'Id',
  allowNull: false
})
frecuencia.belongsTo(Cliente, {
  foreignKey: 'ClienteId',
  targetKey: 'Id',
  allowNull: false,
})

module.exports = Cliente
