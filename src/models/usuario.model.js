const { DataTypes} = require("sequelize");
const sequelize = require("../../bin/config/database");

const Usuario = sequelize.define("usuario", {
  NombreUsuario: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true,
    validate: {
      customValidator(value) {
        if (/^\s*$/.test(value)) {
          throw new Error("usuario.NombreUsuario cannot be empty");
        }
      }
    }
  },
  Contrasena: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      customValidator(value) {
        if (/^\s*$/.test(value)) {
          throw new Error("usuario.Contrasena cannot be empty");
        }
      }
    }
  },
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }
});



module.exports = Usuario
