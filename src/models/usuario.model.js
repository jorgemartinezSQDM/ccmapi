const { DataTypes} = require("sequelize");
const sequelize = require("../../bin/config/database");

const Usuario = sequelize.define("Usuario", {
  NombreUsuario: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  Contrasena: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }
});



module.exports = Usuario
