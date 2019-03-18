const await = require('asyncawait/await'); 
const async = require('asyncawait/async'); 
const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const app = express();

const common = require('anybet-common');
const logger = require('anybet-logging')("WEB");
const exception = common.exceptions("WEB"); 

const api = require('./util/api'); 
const config = require("./config");

'use strict'; 
require('dotenv').config();

function applyCorsHeaders(response) {
    response.setHeader('Access-Control-Allow-Origin', config.allowedOrigins);
    response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Custom-Header');
    response.setHeader("Access-Control-Allow-Headers", "authtoken, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
}

function executeCall(callTitle, req, res, call) {
    exception.try(() => {
        applyCorsHeaders(res);
        var doCall = true; 

        logRequestStart(callTitle, req); 

        //reate a context object 
        const context = createCallContext(req);

        if (doCall) {
            console.log("calling " + callTitle);
            const response = await(call(context)); 
            logRequestEnd(callTitle, response);
            res.status(response.status).send(response.content);
        }
    });
}

function addOptionsCall(app, path){ 
    app.options(path, (req, res) => {
        exception.try(() => {
            logger.info('OPTIONS ' + path);

            applyCorsHeaders(res);
            res.send('{}');
        });
    });
}

function createCallContext(req) {
    return {
        query: req.query,
        body: req.body
    }
}

const commonParamNames = [ "name", "options"]; 

function getRequestParamsAsString(req) {
    let output = ""; 
    if (req) {
        for(let n=0; n<commonParamNames.length; n++) {
            const paramName = commonParamNames[n]; 
            if (req[paramName]) {
                if (output.length) 
                    output += ', '; 
                output += paramName + ':' + req[paramName]; 
            }
        }
    }
    return output; 
}


function logRequestStart(callTitle, request) {
    let text = callTitle; 
    let qstringParams = getRequestParamsAsString(request.query); 
    let bodyParams = null;
    if (request.body) {
        bodyParams = JSON.stringify(request.body); 
    }
    if (bodyParams === "{}")
        bodyParams = "";

    logger.info(text + " " + qstringParams + bodyParams); 
}

function logRequestEnd(callTitle, response) {
    logger.info(callTitle + " returning " + JSON.stringify(response)); 
}


function runWebServer (){
    const sendFile = (res, filename) => {
        exception.try(() => {
            res.sendfile('./public' + filename); 
        });
    };

    const registerGetFile = (filename) => {
        app.get(filename, (req, res) => { 
            exception.try(() => {
                sendFile(res, filename);
            });
        });
    };

    addOptionsCall(app, '/');
    addOptionsCall(app, '/events');
    addOptionsCall(app, '/events/pending');

    //app.use(favicon('./public/images/favicon.ico'));
    app.use('/favicon.ico', express.static('./public/images/favicon.ico'));
    app.use(bodyParser.json());
    app.use(bodyParser());


    app.get('/', (req, res) => { sendFile(res, '/sites.html'); });
    app.get('/index.html', (req, res) => { sendFile(res, '/sites.html'); });
    app.get('/favicon.ico', (req, res) => { 
        console.log('favicon'); 
        sendFile(res, '/images/icon.svg'); 
    }); 

    registerGetFile('/index.html');
    registerGetFile('/providers.html');
    registerGetFile('/events.html');

    registerGetFile('/js/api.js');
    registerGetFile('/js/config.js');
    registerGetFile('/js/common.js');
    registerGetFile('/js/providers.js');
    registerGetFile('/js/events.js');

    registerGetFile('/css/main.css');

    registerGetFile('/images/close-button.png');

    app.get('/events', async((req, res) => {
        executeCall('GET /events', req, res, (context) => {
            return await(api.getAllEvents(context)); 
        });
    })); 

    app.get('/events/pending', async((req, res) => {
        executeCall('GET /events/pending', req, res, (context) => {
            return await(api.getPendingEvents(context)); 
        });
    })); 

    app.get('/events/:eventid', async((req, res) => {
        const eventId = req.params.eventid;
        executeCall(`GET /events/${eventId}`, req, res, (context) => {
            return await(api.getEventDetails(context, eventId)); 
        });
    })); 

    app.post('/events', async((req, res) => {
        executeCall(`POST /events/`, req, res, (context) => {
            return await(api.createEvent(context, context.body.name, context.body.options, context.body.date)); 
        });
    })); 

    app.put('/events/:eventid', async((req, res) => {
        const eventId = req.params.eventid;
        executeCall(`PUT /events/${eventId}/cancel`, req, res, (context) => {
            switch(context.body.action) {
                case "cancel": {
                    return await(api.cancelEvent(context, eventId));
                    break;
                }
                case "lock": {
                    return await(api.lockEvent(context, eventId));
                    break;
                }
                case "complete": {
                    return await(api.completeEvent(context, eventId, context.body.outcome));
                    break;
                }
            }
        });
    })); 

    app.listen(config.httpPort, () => console.log('evs-admin-console listening on port ' + config.httpPort));
}



runWebServer();