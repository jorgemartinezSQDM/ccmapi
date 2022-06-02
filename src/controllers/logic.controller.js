const { Op } = require("sequelize");
const campaignObject = require("../models/campana.model");
const customerObject = require("../models/cliente.model");
const frequencyObject = require("../models/frecuencia.model");
const databaseFunctionsHelper = require("./helpers/database-functions.helper");

const index_logic = async (req, res) => {
  const campaign = await databaseFunctionsHelper.getByAttributes(
    campaignObject,
    { ExternalId: req.body.campana }
  );
  if (!campaign.success)
    res.status(campaign.status).json({ message: "Campaign does not exist" });

  const customer = await databaseFunctionsHelper.getByAttributes(
    customerObject,
    {
      Tipo_Documento: req.body.tipo_documento,
      Numero_Documento: req.body.numero_documento,
    }
  );
  if (!customer.success)
    res.status(customer.status).json({ message: "Customer does not exist" });

  const TODAY_START = new Date();
  TODAY_START.setHours(0, 0, 0, 0);
  const TOMORROW = new Date(TODAY_START);
  TOMORROW.setDate(TOMORROW.getDate() + 1);
  const frequency = await databaseFunctionsHelper.getByAttributes(
    frequencyObject,
    {
      ClienteId: customer.Id,
      CampanaId: campaign.Id,
      createdAt: {
        [Op.gte]: TODAY_START,
        [Op.lt]: TOMORROW,
      },
    }
  );
  console.log("frequency.success => ", frequency.success);
  if (!frequency.success || frequency.success === undefined) {
    console.log("frequency.success ==> ", frequency.success);
    databaseFunctionsHelper
      .single_create(frequencyObject, {
        ClienteId: customer.Id,
        CampanaId: campaign.Id,
        ToquesDia: 1,
      })
      .then((response) => {
        const result = response.result;
        const status = response.status;
        res.json(result).status(status);
      });
  }

  res.status(200).json({
    campaign: campaign.result,
    customer: customer.result,
    frequency: frequency.result,
  });
};

module.exports = {
  index_logic,
};
