'use strict'; 

var profile = (process.env.PROFILE || ''); 

module.exports = {  

    loggingLevel : () => { return getLoggingLevel('LOGGING_LEVEL', 'ALL'); }, 
    clientAppName: () => { return getBooleanSetting('APP_NAME', false);},

    logging: {
        aws: {
            enabled: () => { return getBooleanSetting('ENABLE_AWS_LOGGING', false); },
            apiKey: () => { return getSetting('CLOUDWATCH_ACCESS_KEY', ''); },
            apiSecret: () => { return getSetting('CLOUDWATCH_SECRET_KEY', ''); },
            region: () => { return getSetting('CLOUDWATCH_REGION', 'ap-southeast-2'); },
        }, 

        websocket: {
            enabled: () => { return getBooleanSetting('ENABLE_WEBSOCKET_LOGGING', false); }, 
            port: () => { return getSetting('WEBSOCKET_LOG_PORT', 5000); }
        }, 

        logStreamName : () => { return getSetting('LOG_STREAM_NAME', 'evs')},
        logGroupName : () => { return getSetting('LOG_GROUP_NAME', 'evs')}
    },
};

function makeEnum(elementNames){
    var output = {};
    for(var n=0; n<elementNames.length; n++){
        output[elementNames[n]] = elementNames[n];
    }
    return output; 
}

function getSetting(key, defaultValue){
    if (profile.length)
        key += '_' + profile;
    
    var value = process.env[key]; 
    if (value === null || value === undefined){
        value = defaultValue;
    }

    return value; 
}

function getBooleanSetting(key, defaultValue){
    var value = getSetting(key, defaultValue ? 'true' : 'false'); 
    return (value == 'true'); 
}

function getArraySetting(key, defaultValue, delimiter){
    if (!delimiter)
        delimiter = ',';
    var value = getSetting(key, '');  
    
    if (value && value.length) {
        return value.split(delimiter); 
    }

    var array = defaultValue.split(delimiter);
    return array;
}

function getLoggingLevel(key, defaultValue) {
    var sValue = getSetting(key, defaultValue);
    var output = sValue.trim().toLowerCase();

    if (sValue != 'all' && sValue != 'none') {
        output = output.split(',');
        for(var i=0; i<output.length; i++)
            output[i] = output[i].trim();
    }

    return output; 
}
