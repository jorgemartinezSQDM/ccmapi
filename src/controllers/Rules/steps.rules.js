const rules =  require("./main.rules")
const steps = {
    'step1': {
        name: 'campaing_validation',
        next_step: 'step2',
        failure_step: 'step8',
        step_type: 'Init',
        function: rules.campaing_validation
    },
    'step2': {
        name: 'Customer_validation',
        next_step: 'step3',
        failure_step: 'step8',
        step_type: 'Next',
        function: rules.Customer_validation
    },
    'step3': {
        name: 'blacklist_validation',
        next_step: 'step4',
        failure_step: 'step8',
        step_type: 'Next',
        function: rules.blacklist_validation
    },
    'step4': {
        name: 'frequency_validation',
        next_step: 'step5, step6',
        failure_step: 'step8',
        step_type: 'Next',
        function: rules.frequency_validation
    },
    'step5': {
        name: 'touch_per_day_validation',
        next_step: 'step7',
        failure_step: 'step8',
        step_type: 'Next',
        function:  rules.touch_per_day_validation
    },
    'step6': {
        name: 'Create_frequency',
        next_step: '',
        failure_step: 'step8',
        step_type: 'End',
        function:  rules.Create_frequency
    },
    'step7': {
        name: 'update_frequency',
        next_step: '',
        failure_step: 'step8',
        step_type: 'End',
        function: rules.update_frequency
    },
    'step8': {
        name: 'fails',
        next_step: '',
        failure_step: 'step8',
        step_type: 'End',
        function: rules.fails
    },
    
}

module.exports = {steps}