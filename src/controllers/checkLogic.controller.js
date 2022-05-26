const cliente = require("../models/cliente");
const campana = require("../models/campana");
const frecuencia = require("../models/frecuencia");
const { Op } = require("sequelize");
const index = async (req, res) => {
  /*let mew_cliente = await cliente.bulkCreate([
    {
      Nombres: "hola",
      Apellidos: "hola",
      Tipo_Documento: "hola",
      Numero_Documento: "hola",
    },
    {
      Nombres: "hola",
      Apellidos: "hola",
      Tipo_Documento: "hola",
      Numero_Documento: "hola",
    },
  ]);
  let mew_campana = await campana.create({
    Nombre_Campaña: "hola",
    numeroVecesClientesDia: 2,
  });
  await frecuencia.create({
    ClienteId: mew_cliente.Id,
    campanaId: mew_campana.Id,
  });*/

  let frecuencias = await frecuencia.findAll({
      where: {
        [Op.or]: [
            { ClienteId: 2, campanaId: 1},
            { ClienteId: 5, campanaId: 1},
          ]
      }
  })
  res.json({ text: "Check-Logic", frecuencias });
};

module.exports = {
  index,
};
