'use strict'

const await = require('asyncawait/await'); 
const async = require('asyncawait/async'); 
const express = require('express');
const favicon = require('serve-favicon');
const app = express();

const common = require('anybet-common'); 
const exception = common.exceptions('WEB'); 
const logger = require('anybet-logging')("WEB");

'use strict'; 
require('dotenv').config();

function runWebServer (){
    const sendFile = (res, filename) => {
        return exception.try(() => {
            res.sendfile('./public' + filename); 
        });
    };

    const registerGetFile = (filename) => {
        app.get(filename, (req, res) => { 
            sendFile(res, filename);
        });
    };

    //app.use(favicon('./public/images/favicon.ico'));
    app.use('/favicon.ico', express.static('./public/images/favicon.ico'));

    app.get('/', (req, res) => { sendFile(res, '/providers.html'); });
    app.get('/index.html', (req, res) => { sendFile(res, '/providers.html'); });
    app.get('/favicon.ico', (req, res) => { 
        console.log('favicon'); 
        sendFile(res, '/images/icon.svg'); 
    }); 

    registerGetFile('/providers.html');
    registerGetFile('/events.html');

    registerGetFile('/js/api.js');
    registerGetFile('/js/common.js');
    registerGetFile('/js/config.js');
    registerGetFile('/js/providers.js');
    registerGetFile('/js/events.js');
    registerGetFile('/js/web3.js');

    registerGetFile('/css/main.css');

    registerGetFile('/images/close-button.png');
    
    const httpPort = 8082; 
    app.listen(httpPort, () => console.log('anybet listening on port ' + httpPort));
}


runWebServer();