const rules =  require("./main.rules")
const steps = {
    "get_campaign_customer_data":{
        action: rules.get_campaign_customer_data, 
        type: 'Init'
    },
    "campaing_validation":{
        action: rules.campaing_validation, 
        type: 'Next'
    },
    "customer_validation":{
        action: rules.customer_validation, 
        type: 'Next'
    },
    "blacklist_validation":{
        action: rules.blacklist_validation, 
        type: 'Next'
    },
    "get_frequencies_data":{
        action: rules.get_frequencies_data, 
        type: 'Next'
    },
    "frequencies_validation":{
        action: rules.frequencies_validation, 
        type: 'Next'
    },
    "customer_knocks_per_day_validation":{
        action: rules.customer_knocks_per_day_validation, 
        type: 'Next'
    },
    "campaign_per_day_validation":{
        action: rules.campaign_per_day_validation, 
        type: 'Next'
    },
    "campaign_knocks_per_day_validation":{
        action: rules.campaign_knocks_per_day_validation, 
        type: 'Next'
    },
    "Create_frequency":{
        action: rules.Create_frequency, 
        type: 'End'
    },
    "update_frequency":{
        action: rules.update_frequency, 
        type: 'End'
    },
    "fails":{
        action: rules.fails, 
        type: 'End'
    },


}

module.exports = {steps}