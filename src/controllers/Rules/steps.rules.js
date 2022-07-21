const rules =  require("./main.rules")
const steps = {
    get_campaign_customer_data:{
        function: data => {}, 
        type: 'Init'
    },
    campaing_validation:{
        function: data => {}, 
        type: 'Next'
    },
    customer_validation:{
        function: data => {}, 
        type: 'Next'
    },
    blacklist_validation:{
        function: data => {}, 
        type: 'Next'
    },
    get_frequencies_data:{
        function: data => {}, 
        type: 'Next'
    },
    frequencies_validation:{
        function: data => {}, 
        type: 'Next'
    },
    customer_knocks_per_day_validation:{
        function: data => {}, 
        type: 'Next'
    },
    campaign_per_day_validation:{
        function: data => {}, 
        type: 'Next'
    },
    campaign_knocks_per_day_validation:{
        function: data => {}, 
        type: 'Next'
    },
    Create_frequency:{
        function: data => {}, 
        type: 'End'
    },
    update_frequency:{
        function: data => {}, 
        type: 'End'
    },
    fails:{
        function: data => {}, 
        type: 'End'
    },


}

module.exports = {steps}