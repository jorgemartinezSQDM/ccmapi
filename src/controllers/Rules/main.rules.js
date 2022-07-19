const { Op } = require("sequelize");
const databaseFunctionsHelper = require("../helpers/database-functions.helper");
const campaignObject = require("../../models/campana.model");
const customerObject = require("../../models/cliente.model");
const frequencyObject = require("../../models/frecuencia.model");

const rule_module = (() => {
  const response_fail = (message, caparam, object) => {
    let response = {
      message: message,
      send_campaign: false,
    };
    let status = caparam ? 200 : object.status;
    if (caparam) response = { branchResult: "notsent" };

    const toreturn = {
      next_step: "step8",
      to_return: {
        status,
        response,
      },
    };

    return toreturn;
  };
  let rules = {
    campaing_validation: (data) => {
      return new Promise((resolve, reject) => {
        databaseFunctionsHelper
          .getByAttributes(campaignObject, { ExternalId: data.args.campana })
          .then((campaign) => {
            if (!campaign.success) {
              const toreturn = response_fail(
                "Campaign does not exist",
                data.caparam,
                campaign
              );

              return resolve(toreturn);
            } else {
              data.campaign = campaign;
              data.next_step = "step2";
              return resolve(data);
            }
          })
          .catch((error) => {
            return reject(error);
          });
      });

    },
    Customer_validation: (data) => {
      return new Promise((resolve, reject) => {
        databaseFunctionsHelper
          .getByAttributes(customerObject, {
            Tipo_Documento: data.args.tipo_documento,
            Numero_Documento: data.args.numero_documento,
          })
          .then((customer) => {
            console.log('===================================>')
            console.log(customer)
            console.log('===================================>')
            if (!customer.success) {
              const toreturn = response_fail(
                "Customer does not exist",
                data.caparam,
                customer
              )
              return resolve(
                toreturn
              );
            } else {
              data.customer = customer;
              data.next_step = "step3";
              return resolve(data);
            }
          })
          .catch((error) => {
            return reject(error);
          });
      });
    },
    blacklist_validation: (data) => {
      return new Promise((resolve, reject) => {
        if (data.customer.result.ListaNegra) {
          return resolve(
            this.response_fail(
              "Customer is in a BlackList",
              data.caparam,
              data.customer
            )
          );
        } else {
          data.next_step = "step4";
          return resolve(data);
        }
      });
    },
    frequency_validation: (data) => {
      return new Promise((resolve, reject) => {
        let TODAY_START = new Date();
        if (data.args.createdAt) {
          TODAY_START = new Date(data.args.createdAt);
          //TODAY_START.setDate(TODAY_START.getDate() + 1);
        }
        TODAY_START.setHours(0, 0, 0, 0);
        const TOMORROW = new Date(TODAY_START);
        TOMORROW.setDate(TOMORROW.getDate() + 1);

        data.TODAY_START = TODAY_START
        data.TOMORROW
        /***
         * Obtener frecuencia basados en los parametros obtenidos mas la fecha del dia de hoy
         */
        databaseFunctionsHelper
          .getByAttributes(frequencyObject, {
            ClienteId: data.customer.result.Id,
            CampanaId: data.campaign.result.Id,
            createdAt: {
              [Op.gte]: TODAY_START,
              [Op.lt]: TOMORROW,
            },
          })
          .then((frequency) => {
            if (!frequency.success || frequency.success === undefined) {
              data.next_step = "step6";
              return resolve(data);
            } else {
              data.next_step = "step5";
              data.frequency = frequency;
              return resolve(data);
            }
          })
          .catch((error) => {
            return reject(error);
          });
      });
    },
    touch_per_day_validation: (data) => {
      return new Promise((resolve, reject) => {
        if (
          data.campaign.result.numeroVecesClientesDia >
          data.frequency.result.ToquesDia
        ) {
          data.next_step = "step7";
          return resolve(data);
        } else {
          const toreturn = response_fail(
            "No more messages of these campaigns can be sent to the client for today.",
            data.caparam,
            data.campaign
          );

          return resolve(toreturn);
        }
      });
    },
    Create_frequency: (data) => {
      return new Promise((resolve, reject) => {
        /**
         * si no existe la frecuencia la creamos
         */
        let responseSer = {
          message: "A frequency has been created.",
          send_campaign: true,
        };

        if (data.caparam) responseSer = { branchResult: "sent" };

        databaseFunctionsHelper
          .single_create(frequencyObject, {
            ClienteId: data.customer.result.Id,
            CampanaId: data.campaign.result.Id,
            ToquesDia: 1,
            createdAt: data.TODAY_START,
          })
          .then((response) => {
            const result = response.result;
            const status = data.caparam ? 200 : response.status;
            data.to_return = {
              status: 200,
              response: responseSer,
            };
            data.step_type = "End";
            return resolve(data);
          })
          .catch((error) => {
            let responseSer = error;
            let status = 500;
            if (data.caparam) {
              responseSer = { branchResult: "notsent" };
              status = 400;
            }

            return resolve({
              next_step: "step8",
              to_return: {
                status,
                response: responseSer,
              },
            });
          });
      });
    },
    update_frequency: (data) => {
      return new Promise((resolve, reject) => {
        /**
         * Si aun no cumple con los toques maximos del dia, le sumamos un toque y
         * regresamos una respuesta de envio.
         */
        let responseSer = {
          message: "Increase in frequency.",
          send_campaign: true,
        };

        if (data.caparam) responseSer = { branchResult: "sent" };

        frequencyObject
          .increment({ ToquesDia: 1 }, { where: { Id: data.frequency.result.Id } })
          .then((result) => {
            data.to_return = {
              status: 200,
              response: responseSer,
            };
            data.step_type = "End";
            return resolve(data);
          })
          .catch((error) => {
            let responseSer = data.caparam
              ? { branchResult: "notsent" }
              : error;
            let status = data.caparam ? 400 : 500;

            return resolve({
              next_step: "step8",
              to_return: {
                status,
                response: responseSer,
              },
            });
          });
      });
    },
    fails: (data) => {
      return new Promise((resolve, reject) => {
        data.step_type = "End";
        return resolve(data);
      });
    },
  };

  return rules;
})();

module.exports = rule_module;
