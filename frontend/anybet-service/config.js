
const configUtil = require('anybet-common').config;

module.exports = {  

    loggingLevel : configUtil.getLoggingLevel('LOGGING_LEVEL', 'ALL'),
    httpPort: configUtil.getSetting('HTTP_PORT', 8084),
    httpsPort: configUtil.getSetting('HTTPS_PORT', 8084),
    useTls: configUtil.getBooleanSetting('USE_TLS', false),
    authEnabled: configUtil.getBooleanSetting('AUTH_ENABLED', true),
    authExpirationMinutes: configUtil.getSetting('AUTH_EXPIRATION_MINUTES', 360), 
    allowedOrigins: configUtil.getSetting('ALLOWED_CORS_ORIGINS', 'http://localhost:8082'), 

    aws: {
        cognito: {
            userPoolId: configUtil.getSetting('AWS_USER_POOL_ID', ''), 
            appClientId: configUtil.getSetting('AWS_APP_CLIENT_ID', '')
        }
    }, 
};

