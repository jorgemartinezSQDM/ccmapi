const { Op } = require("sequelize");
const databaseFunctionsHelper = require("../helpers/database-functions.helper");
const campaignObject = require("../../models/campana.model");
const customerObject = require("../../models/cliente.model");
const frequencyObject = require("../../models/frecuencia.model");

const rule_module = (() => {
  
  const fail_message = (message, caparam) => {
    let response = {
      message: message,
      send_campaign: false,
    };
    let status = caparam ? 200 : campaign.status;
    if (caparam) response = { branchResult: "notsent" };

    //res.status(campaign.status).json(response);
    return {
      status,
      response,
    };
  }

  const next_step_validation = (booleanParam, data, failMessage, nextStep) => {
    
      if (booleanParam) {
        data.next_step = 'fails'
        data.to_return = fail_message (failMessage, data.caparam)
        return data
      }

      data.next_step = nextStep
      return data
  }

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


  let rules = {

    

    get_campaign_customer_data: data => {
      const args = data.args
      const [campaign, customer] = await Promise.all([
        databaseFunctionsHelper.getByAttributes(
          campaignObject,
          {
            ExternalId: args.campana,
          }
        ), 
        databaseFunctionsHelper.getByAttributes(
          customerObject,
          {
            Tipo_Documento: args.tipo_documento,
            Numero_Documento: args.numero_documento,
          }
        )
      ]);

      data.campaign = campaign
      data.customer = customer 
      data.next_step = 'campaing_validation'
      return data
    },
    campaing_validation: data => {
      //const campaign = data.campaign
      
      return next_step_validation(!campaign.success, data, "Campaign does not exist", 'customer_validation')
      /*if (!campaign.success) {
        data.next_step = 'fails'
        data.to_return = fail_message ("Campaign does not exist", data.caparam)
        return data
      }

      data.next_step = 'customer_validation'
      return data*/
    },
    customer_validation: data => {
      //const customer = data.customer

      return next_step_validation(!customer.success, data, "Customer does not exist", 'blacklist_validation')
      /*if (!customer.success) {
        data.next_step = 'fails'
        data.to_return = fail_message ("Customer does not exist", data.caparam)
        return data
      }

      data.next_step = 'blacklist_validation'
      return data*/
    },
    blacklist_validation: data => {
      //const customer = data.customer

      return next_step_validation(customer.result.ListaNegra, data, "Customer is in a BlackList", 'get_frequencies_data')
      /*if (customer.result.ListaNegra) {
        data.next_step = 'fails'
        data.to_return = fail_message ("Customer is in a BlackList", data.caparam)
        return data
      }

      data.next_step ='get_frequencies_data'
      return data*/
    },
    get_frequencies_data: data => {
      let TODAY_START = new Date();
      if (data.args.createdAt) {
        TODAY_START = new Date(data.args.createdAt);
        //TODAY_START.setDate(TODAY_START.getDate() + 1);
      }
      TODAY_START.setHours(0, 0, 0, 0);
      const TOMORROW = new Date(TODAY_START);
      TOMORROW.setDate(TOMORROW.getDate() + 1);
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
      data.TODAY_START = TODAY_START
      data.frequencies = frequencies
      data.next_step = 'frequencies_validation'
      return data
    }

  }
  return rules;
})();

module.exports = rule_module;
