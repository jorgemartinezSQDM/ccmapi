const { Op } = require("sequelize");
const databaseFunctionsHelper = require("../helpers/database-functions.helper");
const campaignObject = require("../../models/campana.model");
const customerObject = require("../../models/cliente.model");
const frequencyObject = require("../../models/frecuencia.model");

const rule_module = (() => {
  
  const fail_message = (message, caparam, in_status) => {
    let response = {
      message: message,
      send_campaign: false,
    };
    let status = caparam ? 200 : in_status;
    if (caparam) response.branchResult= "notsent" ;

    return {
      status,
      response,
    };
  }

  const next_step_validation = (booleanParam, data, failMessage, nextStep, status) => {
    
      if (booleanParam) {
        data.next_step = 'fails'
        data.to_return = fail_message (failMessage, data.caparam, status)
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
  
      if (caparam) responseSer.branchResult = "sent" ;
  
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
          let responseSer = {error: error};
          let status = 500;
          if (caparam) {
            responseSer.branchResult = "notsent" ;
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


  const updateFrequency = (frequency, caparam) => {
    return new Promise((resolve, reject) => {
      /**
             * Si aun no cumple con los toques maximos del dia, le sumamos un toque y
             * regresamos una respuesta de envio.
             */
       let responseSer = {
        message: "Increase in frequency.",
        send_campaign: true,
      };

      if (caparam) responseSer.branchResult = "sent" ;

      frequencyObject
        .increment(
          { ToquesDia: 1 },
          { where: { Id: frequency.Id } }
        )
        .then((result) => {
          //res.status(200).json(responseSer);
          return resolve({
            status: 200,
            response: responseSer,
          });
        })
        .catch((error) => {
          let responseSer = { branchResult: "notsent", error } ;
          let status = caparam ? 400 : 500;

          //res.status(status).json(responseSer);
          return reject({
            status,
            response: responseSer,
          });
        });
    });
  };


  let rules = {

    

    get_campaign_customer_data: async (data) => {
      //console.log(' get_campaign_customer_data - data.args => ' + data.args)
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

      //console.log(JSON.stringify(campaign), JSON.stringify(customer))
      data.campaign = campaign
      data.customer = customer 
      data.next_step = 'campaing_validation'
      return data
    },
    campaing_validation: data => {
      //const campaign = data.campaign
      
      return next_step_validation(!data.campaign.success, data, "Campaign does not exist", 'customer_validation', data.campaign.status)
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

      return next_step_validation(!data.customer.success, data, "Customer does not exist", 'blacklist_validation', data.customer.status)
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

      return next_step_validation(data.customer.result.ListaNegra, data, "Customer is in a BlackList", 'get_frequencies_data', data.customer.status)
      /*if (customer.result.ListaNegra) {
        data.next_step = 'fails'
        data.to_return = fail_message ("Customer is in a BlackList", data.caparam)
        return data
      }

      data.next_step ='get_frequencies_data'
      return data*/
    },
    get_frequencies_data: async (data) => {
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
          ClienteId: data.customer.result.Id,
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
    },
    frequencies_validation: data => {
      let frequencies = data.frequencies
      if(!frequencies.success || frequencies.success === undefined) {
        data.next_step = 'create_frequency'
      } else {
        data.next_step = 'customer_knocks_per_day_validation'
      }
      return data
    },
    create_frequency: async (data) => {
      let responseSer = await crearFrecuencia(data.customer, data.campaign, data.TODAY_START, data.caparam)
      data.step_type = 'End'
      data.to_return = responseSer
      return data
    },
    customer_knocks_per_day_validation: data => {
      
      let fqs = [];
      let campaigns = {};
      let knocksPerDay = 0;
      let frequencies = data.frequencies

      if (frequencies.Records.length === undefined) {
        fqs.push(frequencies.Records);
      } else {
        fqs.push(...frequencies.Records);
      }
      
      for (let freq of fqs) {
        campaigns[freq.CampanaId] = freq;
        knocksPerDay += freq.ToquesDia;
      }

      //console.log("=>>> " + knocksPerDay + " === " + parseInt(process.env.MAX_knocksPerDay))

      if (knocksPerDay === parseInt(process.env.MAX_knocksPerDay)) {
        let responseSer = {
          message: "This message cannot be sent. Knocks limit per day.",
          send_campaign: false,
        };

        if (data.caparam) responseSer.branchResult = "notsent";

        //res.status(200).json(responseSer);
        data.step_type = 'End'
        data.to_return = {
          status: 200,
          response: responseSer,
        }
        return data
      }

      data.campaigns = campaigns
      data.knocksPerDay = knocksPerDay
      data.keysCampa = Object.keys(campaigns);
      data.next_step = 'campaign_per_day_validation'
      return data

    },
    campaign_per_day_validation: async (data) => {
      if (
        data.keysCampa.length < parseInt(process.env.MAX_CAMPAIGN_PER_DAY) && 
        !data.keysCampa.includes("" + data.campaign.result.Id)
        ) {

        data.next_step = 'create_frequency' 

      } else if (
        data.keysCampa.length === parseInt(process.env.MAX_CAMPAIGN_PER_DAY) && 
        !data.keysCampa.includes("" + data.campaign.result.Id)
        ) {

        let responseSer = {
          message: "This message cannot be sent. Campaign limit per day.",
          send_campaign: false,
        };

        if (data.caparam) responseSer.branchResult = "notsent";

        
        data.step_type = 'End'
        data.to_return =  {
          status: 200,
          response: responseSer,
        };
      } else if (
        data.keysCampa.length <= 2 &&
        data.keysCampa.includes("" + data.campaign.result.Id)
      ){

        data.next_step = 'campaign_knocks_per_day_validation' 
      
      }


      return data
    },
    campaign_knocks_per_day_validation: data => {
      let frequency = data.campaigns[data.campaign.result.Id]
      let campaign = data.campaign
      //console.log('frequency =>> ' + JSON.stringify(frequency))
      //console.log('campaign =>> ' + JSON.stringify(campaign))
      if (
        campaign.result.numeroVecesClientesDia > frequency.ToquesDia
      ) {
        data.next_step = 'update_frequency'
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

        if (data.caparam) responseSer.branchResult = "notsent";

        data.step_type = 'End'
        data.to_return = {
          status: 200,
          response: responseSer,
        }
      }
        return data

    },
    update_frequency: async (data) => {
      let frequency = data.campaigns[data.campaign.result.Id]
      let responseSer = await updateFrequency (frequency, data.caparam)
      data.step_type = 'End'
      data.to_return = responseSer
      return data
    },
    fails: data => {
      data.step_type = 'End'
      return data
    }


  }
  return rules;
})();

module.exports = rule_module;
