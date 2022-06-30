const { DataTypes} = require("sequelize");
const sequelize = require("../../bin/config/database");
const frecuencia = require("./frecuencia.model")

const Cliente = sequelize.define("cliente", {
  Nombres: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      customValidator(value) {
        if (/^\s*$/.test(value)) {
          throw new Error("cliente.Nombres cannot be empty");
        }
      }
    }
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
    type: DataTypes.ENUM({
      values: ['CC', 'TI', 'CE', 'PA']
    }),
    allowNull: false,
  },
  Numero_Documento: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      customValidator(value) {
        if (/^\s*$/.test(value)) {
          throw new Error("cliente.Numero_Documento cannot be empty");
        }
      }
    }
  },
  llaveUnicaCliente: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      customValidator(value) {
        if (/^\s*$/.test(value)) {
          throw new Error("cliente.llaveUnicaCliente cannot be empty");
        }
      }
    }
  },
  ListaNegra: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
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
