const { Op } = require("sequelize");
const campaignObject = require("../models/campana.model");
const customerObject = require("../models/cliente.model");
const frequencyObject = require("../models/frecuencia.model");
const databaseFunctionsHelper = require("./helpers/database-functions.helper");

const index_logic = async (req, res) => {
  index_logic_helper(req.body, res, false);
};

const index_logic_helper = async (args, res, caparam) => {
  /***
   * Validando existencia de la campaña
   */
  /*console.log("_____________________________")
  console.log('args => ', args)
  console.log("_____________________________")*/
  const campaign = await databaseFunctionsHelper.getByAttributes(
    campaignObject,
    { ExternalId: args.campana }
  );
  if (!campaign.success) {
    let response = { message: "Campaign does not exist", send_campaign: false };
    if (caparam) response = { branchResult: "notsent" };
    console.log("25--------------------------");
    console.log(response);
    console.log("--------------------------");
    res.status(campaign.status).json(response);
    return;
  }

  /***
   * Validando existencia del cliente
   */
  const customer = await databaseFunctionsHelper.getByAttributes(
    customerObject,
    {
      Tipo_Documento: args.tipo_documento,
      Numero_Documento: args.numero_documento,
    }
  );
  if (!customer.success) {
    let response = { message: "Customer does not exist", send_campaign: false };
    if (caparam) response = { branchResult: "notsent" };
    console.log("45--------------------------");
    console.log(response);
    console.log("--------------------------");
    res.status(customer.status).json(response);
    return;
  }

  if (customer.result.ListaNegra) {
    let response = {
      message: "Customer is in a BlackList",
      send_campaign: false,
    };

    if (caparam) response = { branchResult: "notsent" };
    console.log("59--------------------------");
    console.log(response);
    console.log("--------------------------");
    res.status(customer.status).json(response);
    return;
  } else {
    let TODAY_START = new Date();
    if (args.createdAt) {
      TODAY_START = new Date(args.createdAt);
      //TODAY_START.setDate(TODAY_START.getDate() + 1);
    }
    TODAY_START.setHours(0, 0, 0, 0);
    const TOMORROW = new Date(TODAY_START);
    TOMORROW.setDate(TOMORROW.getDate() + 1);
    /*console.log("=================================");
    console.log("TODAY_START => " + TODAY_START);
    console.log("TOMORROW => " + TOMORROW);
    console.log("=================================");*/
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
      let responseSer = {
        message: "A frequency has been created.",
        send_campaign: true,
      };

      if (caparam) responseSer = { branchResult: "sent" };
      console.log("104--------------------------");
      console.log(responseSer);
      console.log("--------------------------");
      databaseFunctionsHelper
        .single_create(frequencyObject, {
          ClienteId: customer.result.Id,
          CampanaId: campaign.result.Id,
          ToquesDia: 1,
          createdAt: TODAY_START,
        })
        .then((response) => {
          const result = response.result;
          const status = response.status;
          res.status(status).json(responseSer);
          return;
        })
        .catch((error) => {
          let responseSer = error;
          let status = 500;
          if (caparam) {
            responseSer = { branchResult: "notsent" };
            status = 200;
          }
          res.status(status).json(responseSer);
          return;
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
        let responseSer = {
          message: "Increase in frequency.",
          send_campaign: true,
        };

        if (caparam) responseSer = { branchResult: "sent" };
        console.log("139--------------------------");
        console.log(responseSer);
        console.log("--------------------------");
        frequencyObject
          .increment({ ToquesDia: 1 }, { where: { Id: frequency.result.Id } })
          .then((result) => {
            res.status(200).json(responseSer);
            return;
          })
          .catch((error) => {
            let responseSer = error;
            let status = 500;
            if (caparam) {
              responseSer = { branchResult: "notsent" };
              status = 200;
            }
            res.status(status).json(responseSer);
            return;
          });
      } else {
        /**
         * En caso que ya se hayan cumplido el numero maximo de toques por dia, regresamos
         * un mensaje donde no es permitido enviar el mensaje de campaña.
         */

        let responseSer = {
          message:
            "No more messages of these campaigns can be sent to the client for today.",
          send_campaign: false,
        };

        if (caparam) responseSer = { branchResult: "notsent" };
        console.log("165--------------------------");
        console.log(responseSer);
        console.log("--------------------------");
        res.status(200).json(responseSer);
        return;
      }
    }
  }
};

module.exports = {
  index_logic,
  index_logic_helper,
};
