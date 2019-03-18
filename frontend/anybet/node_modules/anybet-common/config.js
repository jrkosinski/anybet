'use strict'; 

const configUtil = require('./util/configUtil'); 

module.exports = {  

    loggingLevel : () => { return configUtil.getLoggingLevel('LOGGING_LEVEL', 'ALL'); }, 
    clientAppName: () => { return configUtil.getBooleanSetting('APP_NAME', false);},

    logging: {
        aws: {
            enabled: () => { return configUtil.getBooleanSetting('ENABLE_AWS_LOGGING', false); },
            apiKey: () => { return configUtil.getSetting('CLOUDWATCH_ACCESS_KEY', ''); },
            apiSecret: () => { return configUtil.getSetting('CLOUDWATCH_SECRET_KEY', ''); },
            region: () => { return configUtil.getSetting('CLOUDWATCH_REGION', 'ap-southeast-2'); },
        },   

        logStreamName : () => { return configUtil.getSetting('LOG_STREAM_NAME', 'evs')},
        logGroupName : () => { return configUtil.getSetting('LOG_GROUP_NAME', 'evs')}
    },
};

