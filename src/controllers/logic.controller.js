const { Op } = require("sequelize");
const campaignObject = require("../models/campana.model");
const customerObject = require("../models/cliente.model");
const frequencyObject = require("../models/frecuencia.model");
const databaseFunctionsHelper = require("./helpers/database-functions.helper");
const rules = require('./Rules/steps.rules')

const index_logic = (req, res) => {
  let data = {
    args: req.body,
    next_step: 'get_campaign_customer_data',
    caparam: false
  };

  run_logic(data, res)
  /*rules.steps['step1'].function(data).then((response) => {
    
    if (response.to_return) {
      res.status(response.to_return.status).json(response.to_return.response);
      return;
    }
    //res.status(response.campaign.status).json(response.campaign.result);
  });*/
  /*index_logic_helper(req.body, res, false)
    .then((response) => {
      //console.log("response => " + JSON.stringify(response));
      res.status(response.status).json(response.response);
      return;
    })
    .catch((error) => {
      res.status(400).json(error);
      return;
    });*/
};

const run_logic = (data, res) => {
  console.log('data.next_step => ' + data.next_step)
  console.log('rules[data.next_step] => ' + JSON.stringify(rules.steps))
  const response = rules.steps[data.next_step].action(data)
  
  if (response.step_type === 'End' && response.to_return) {
    res.status(response.to_return.status).json(response.to_return.response);
    return;
  }

  run_logic(response, res)
  /*rules.steps[data.next_step].function(data).then((response) => {
    console.log('=========================================================')
    console.log(response)

    

    run_logic(response, res)
    //res.status(response.campaign.status).json(response.campaign.result);
  });*/
}


const index_logic_helper = (args, res, caparam) => {
  return new Promise(async (resolve, reject) => {
    /***
     * Validando existencia de la campaña
     */

    const campaign = await databaseFunctionsHelper.getByAttributes(
      campaignObject,
      {
        ExternalId: args.campana,
      }
    );

    if (!campaign.success) {
      let response = {
        message: "Campaign does not exist",
        send_campaign: false,
      };
      let status = caparam ? 200 : campaign.status;
      if (caparam) response = { branchResult: "notsent" };

      //res.status(campaign.status).json(response);
      return resolve({
        status,
        response,
      });
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
      let response = {
        message: "Customer does not exist",
        send_campaign: false,
      };
      let status = caparam ? 200 : customer.status;
      if (caparam) response = { branchResult: "notsent" };

      //res.status(customer.status).json(response);
      return resolve({
        status,
        response,
      });
    }

    if (customer.result.ListaNegra) {
      let response = {
        message: "Customer is in a BlackList",
        send_campaign: false,
      };
      let status = caparam ? 200 : customer.status;
      if (caparam) response = { branchResult: "notsent" };

      //res.status(customer.status).json(response);
      return resolve({
        status,
        response,
      });
    } else {
      let TODAY_START = new Date();
      if (args.createdAt) {
        TODAY_START = new Date(args.createdAt);
        //TODAY_START.setDate(TODAY_START.getDate() + 1);
      }
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
      const frequencies = await databaseFunctionsHelper.getAll2(
        frequencyObject,
        0,
        100,
        {
          ClienteId: customer.result.Id,
          createdAt: {
            [Op.gte]: TODAY_START,
            [Op.lt]: TOMORROW,
          },
        }
      );

      /**
       * Validando si existe la frecuencia
       */

      if (
        (!frequency.success || frequency.success === undefined) &&
        (!frequencies.success || frequencies.success === undefined)
      ) {
        crearFrecuencia(customer, campaign, TODAY_START, caparam)
          .then((response) => {
            return resolve(response);
          })
          .catch((error) => {
            return reject(error);
          });
      } else {
        /***
         * Si existe la frecuencia, validamos que un no cumpla con el dia de toques maximos del dia
         */
        let campa = {};
        //console.log("===============================");
        //console.log(frequencies);
        let fqs = [];
        if (frequencies.Records.length === undefined) {
          fqs.push(frequencies.Records);
        } else {
          fqs.push(...frequencies.Records);
        }
        //console.log(fqs);
        //console.log("===============================");
        let knocksPerDay = 0;
        for (let freq of fqs) {
          campa[freq.CampanaId] = freq.CampanaId;
          knocksPerDay += freq.ToquesDia;
        }

        console.log("=>> knocksPerDay => ", knocksPerDay);
        var keysCampa = Object.keys(campa);
        //console.log("keysCampa => ", keysCampa);
        if (knocksPerDay === 4) {
          let responseSer = {
            message: "This message cannot be sent. Knocks limit per day.",
            send_campaign: false,
          };

          if (caparam) responseSer = { branchResult: "notsent" };

          //res.status(200).json(responseSer);
          return resolve({
            status: 200,
            response: responseSer,
          });
        } else if (
          keysCampa.length < 2 &&
          !keysCampa.includes("" + campaign.result.Id)
        ) {
          crearFrecuencia(customer, campaign, TODAY_START, caparam)
            .then((response) => {
              return resolve(response);
            })
            .catch((error) => {
              return reject(error);
            });
        } else if (
          keysCampa.length === 2 &&
          !keysCampa.includes("" + campaign.result.Id)
        ) {
          let responseSer = {
            message: "This message cannot be sent. Campaign limit per day.",
            send_campaign: false,
          };

          if (caparam) responseSer = { branchResult: "notsent" };

          //res.status(200).json(responseSer);
          return resolve({
            status: 200,
            response: responseSer,
          });
        } else if (
          keysCampa.length <= 2 &&
          keysCampa.includes("" + campaign.result.Id)
        ) {
          if (
            campaign.result.numeroVecesClientesDia > frequency.result.ToquesDia
          ) {
            /**
             * Si aun no cumple con los toques maximos del dia, le sumamos un toque y
             * regresamos una respuesta de envio.
             */
            let responseSer = {
              message: "Increase in frequency.",
              send_campaign: true,
            };

            if (caparam) responseSer = { branchResult: "sent" };

            frequencyObject
              .increment(
                { ToquesDia: 1 },
                { where: { Id: frequency.result.Id } }
              )
              .then((result) => {
                //res.status(200).json(responseSer);
                return resolve({
                  status: 200,
                  response: responseSer,
                });
              })
              .catch((error) => {
                let responseSer = caparam ? { branchResult: "notsent" } : error;
                let status = caparam ? 400 : 500;

                //res.status(status).json(responseSer);
                return reject({
                  status,
                  response: responseSer,
                });
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

            //res.status(200).json(responseSer);
            return resolve({
              status: 200,
              response: responseSer,
            });
          }
        }
      }
    }
  });
};

const crearFrecuencia = (customer, campaign, TODAY_START, caparam) => {
  return new Promise((resolve, reject) => {
    /**
     * si no existe la frecuencia la creamos
     */
    let responseSer = {
      message: "A frequency has been created.",
      send_campaign: true,
    };

    if (caparam) responseSer = { branchResult: "sent" };

    databaseFunctionsHelper
      .single_create(frequencyObject, {
        ClienteId: customer.result.Id,
        CampanaId: campaign.result.Id,
        ToquesDia: 1,
        createdAt: TODAY_START,
      })
      .then((response) => {
        const result = response.result;
        const status = caparam ? 200 : response.status;

        //res.status(status).json(responseSer);
        return resolve({
          status,
          response: responseSer,
        });
      })
      .catch((error) => {
        let responseSer = error;
        let status = 500;
        if (caparam) {
          responseSer = { branchResult: "notsent" };
          status = 400;
        }
        //res.status(status).json(responseSer);
        return reject({
          status,
          response: responseSer,
        });
      });
  });
};
module.exports = {
  index_logic,
  index_logic_helper,
};
