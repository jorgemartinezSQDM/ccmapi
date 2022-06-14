const { Op } = require("sequelize");
const campaignObject = require("../models/campana.model");
const customerObject = require("../models/cliente.model");
const frequencyObject = require("../models/frecuencia.model");
const databaseFunctionsHelper = require("./helpers/database-functions.helper");

const index_logic = async (req, res) => {
  /***
   * Validando existencia de la campaña
   */
  const campaign = await databaseFunctionsHelper.getByAttributes(
    campaignObject,
    { ExternalId: req.body.campana }
  );
  if (!campaign.success)
    res
      .status(campaign.status)
      .json({ message: "Campaign does not exist", send_campaign: false });
  /***
   * Validando existencia del cliente
   */
  const customer = await databaseFunctionsHelper.getByAttributes(
    customerObject,
    {
      Tipo_Documento: req.body.tipo_documento,
      Numero_Documento: req.body.numero_documento,
    }
  );
  if (!customer.success) {
    res
      .status(customer.status)
      .json({ message: "Customer does not exist", send_campaign: false });
  }

  if (customer.result.ListaNegra) {
    res
      .status(customer.status)
      .json({ message: "Customer is in a BlackList", send_campaign: false });
  } else {
    const TODAY_START = new Date();
    TODAY_START.setHours(0, 0, 0, 0);
    const TOMORROW = new Date(TODAY_START);
    TOMORROW.setDate(TOMORROW.getDate() + 1);

    /***
     * Obtener frecuencia basados en los parametros obtenidos mas la fecha del dia de hoy
     */
    const frequency = await databaseFunctionsHelper.getByAttributes(
      frequencyObject,
      {
        ClienteId: customer.result.Id,
        CampanaId: campaign.result.Id,
        createdAt: {
          [Op.gte]: TODAY_START,
          [Op.lt]: TOMORROW,
        },
      }
    );
    /**
     * Validando si existe la frecuencia
     */
    if (!frequency.success || frequency.success === undefined) {
      /**
       * si no existe la frecuencia la creamos
       */
      databaseFunctionsHelper
        .single_create(frequencyObject, {
          ClienteId: customer.result.Id,
          CampanaId: campaign.result.Id,
          ToquesDia: 1,
        })
        .then((response) => {
          const result = response.result;
          const status = response.status;
          res
            .json({
              message: "A frequency has been created.",
              send_campaign: true,
            })
            .status(status);
        })
        .catch((error) => {
          res.status(500).json(error);
        });
    } else {
      /***
       * Si existe la frecuencia, validamos que un no cumpla con el dia de toques maximos del dia
       */
      if (campaign.result.numeroVecesClientesDia > frequency.result.ToquesDia) {
        /**
         * Si aun no cumple con los toques maximos del dia, le sumamos un toque y
         * regresamos una respuesta de envio.
         */
        frequencyObject
          .increment({ ToquesDia: 1 }, { where: { Id: frequency.result.Id } })
          .then((result) => {
            res.status(200).json({
              message: "Increase in frequency.",
              send_campaign: true,
            });
          })
          .catch((error) => {
            res.status(500).json(error);
          });
      } else {
        /**
         * En caso que ya se hayan cumplido el numero maximo de toques por dia, regresamos
         * un mensaje donde no es permitido enviar el mensaje de campaña.
         */
        res.status(200).json({
          message:
            "No more messages of these campaigns can be sent to the client for today.",
          send_campaign: false,
        });
      }
    }
  }
};

module.exports = {
  index_logic,
};
