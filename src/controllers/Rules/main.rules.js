const databaseFunctionsHelper = require("../helpers/database-functions.helper");
const campaignObject = require("../models/campana.model");
const customerObject = require("../models/cliente.model");
const frequencyObject = require("../models/frecuencia.model");

const rule_module = ({
    response_fail: (message, caparam) => {
        let response = {
            message: message,
            send_campaign: false,
        };
        let status = caparam ? 200 : campaign.status;
        if (caparam) response = { branchResult: "notsent" };
        
        
        return {
            next_step: 'step8',
            to_return: {
                status,
                response,
            }
        };
    },
    campaing_validation : async (data) => {
        const campaign = await databaseFunctionsHelper.getByAttributes(
            campaignObject,
            { ExternalId: data.args.campana }
        );

        if (!campaign.success) {
            return this.response_fail("Campaign does not exist", data.caparam);
            /*let response = {
              message: "Campaign does not exist",
              send_campaign: false,
            };
            let status = caparam ? 200 : campaign.status;
            if (caparam) response = { branchResult: "notsent" };
            
            
            return {
                next_step: 'step8',
                to_return: {
                    status,
                    response,
                }
            };*/
        } else {
            data.campaign = campaign
            data.next_step = 'step2'
            return data
        }

    },
    Customer_validation: async(data) => {
        const customer = await databaseFunctionsHelper.getByAttributes(
            customerObject,
            {
              Tipo_Documento: data.args.tipo_documento,
              Numero_Documento: data.args.numero_documento,
            }
          );
          if (!customer.success) {
            return this.response_fail("Customer does not exist", data.caparam);
            /*let response = {
              message: "Customer does not exist",
              send_campaign: false,
            };
            let status = caparam ? 200 : customer.status;
            if (caparam) response = { branchResult: "notsent" };
            
            return {
                next_step: 'step8',
                to_return: {
                    status,
                    response,
                }
            };*/
          } else {
            data.customer = customer
            data.next_step = 'step3'
            return data
        }
    },
    blacklist_validation: (data) => {
        if (data.customer.result.ListaNegra){
            return this.response_fail("Customer is in a BlackList", data.caparam);
            /*let response = {
                message: "Customer is in a BlackList",
                send_campaign: false,
            };
            let status = caparam ? 200 : customer.status;
            if (caparam) response = { branchResult: "notsent" };
                
                //res.status(customer.status).json(response);
            return {
                next_step: 'step8',
                to_return: {
                    status,
                    response,
                }
            };*/
        } else {
            data.next_step = 'step4'
            return data
        }
        
    },
    frequency_validation: async (data) => {
        let TODAY_START = new Date();
        if (data.args.createdAt) {
          TODAY_START = new Date(data.args.createdAt);
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
            ClienteId: data.customer.result.Id,
            CampanaId: data.campaign.result.Id,
            createdAt: {
              [Op.gte]: TODAY_START,
              [Op.lt]: TOMORROW,
            },
          }
        );
        if (!frequency.success || frequency.success === undefined) {
            data.next_step = 'step6'
            return data
        } else {
            data.next_step = 'step5'
            data.frequency = frequency
            return data
        }
    },
    touch_per_day_validation: (data) => {
        if (data.campaign.result.numeroVecesClientesDia > data.frequency.result.ToquesDia) {

        } else {

        }
    },
    Create_frequency: (data) => {
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
                ClienteId: customer.result.Id,
                CampanaId: campaign.result.Id,
                ToquesDia: 1,
                createdAt: TODAY_START,
            })
            .then((response) => {
                const result = response.result;
                const status = caparam ? 200 : response.status;
                data.to_return = {
                    status: 200,
                    response: responseSer,
                }
                data.step_type = 'End'
                return data
                //res.status(status).json(responseSer);
                /*return resolve({
                    status,
                    response: responseSer,
                });*/
            })
            .catch((error) => {
                let responseSer = error;
                let status = 500;
                if (caparam) {
                    responseSer = { branchResult: "notsent" };
                    status = 400;
                }
                //res.status(status).json(responseSer);
                /*return reject({
                status,
                response: responseSer,
                });*/
                return {
                    next_step: 'step8',
                    to_return: {
                        status,
                        response: responseSer,
                    }
                };
            });
    },
    update_frequency: (data) => {
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
            .increment({ ToquesDia: 1 }, { where: { Id: frequency.result.Id } })
            .then((result) => {
                //res.status(200).json(responseSer);
                data.to_return = {
                    status: 200,
                    response: responseSer,
                }
                data.step_type = 'End'
                return data
                /*resolve({
                status: 200,
                response: responseSer,
                });*/
            })
        .catch((error) => {
            let responseSer = data.caparam ? { branchResult: "notsent" } : error;
            let status = data.caparam ? 400 : 500;

            //res.status(status).json(responseSer);
            /*return reject({
            status,
            response: responseSer,
            });*/
            return {
                next_step: 'step8',
                to_return: {
                    status,
                    response: responseSer,
                }
            };
        });
    },
    fails: (data) => {
        data.step_type = 'End'
        return data
    },


})();

module.exports = rule_module