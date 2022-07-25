const rules = require("./main.rules");
const steps = {
  "get_campaign_customer_data": {
    type: "Init",
    function: rules.get_campaign_customer_data,
  },
  "campaing_validation": {
    type: "Next",
    function: rules.campaing_validation,
    
  },
  "customer_validation": {
    type: "Next",
    function: rules.customer_validation,
  },
  "blacklist_validation": {
    type: "Next",
    function: rules.blacklist_validation,
  },
  "get_frequencies_data": {
    type: "Next",
    function: rules.get_frequencies_data,
  },
  "frequencies_validation": {
    type: "Next",
    function: rules.frequencies_validation,
  },
  "customer_knocks_per_day_validation": {
    type: "Next",
    function: rules.customer_knocks_per_day_validation,
  },
  "campaign_per_day_validation": {
    type: "Next",
    function: rules.campaign_per_day_validation,
  },
  "campaign_knocks_per_day_validation": {
    type: "Next",
    function: rules.campaign_knocks_per_day_validation,
  },
  "create_frequency": {
    type: "End",
    function: rules.create_frequency,
  },
  "update_frequency": {
    type: "End",
    function: rules.update_frequency,
  },
  "fails": {
    type: "End",
    function: rules.fails,
  },
};

module.exports = { steps };
