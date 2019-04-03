'use strict'

const await = require('asyncawait/await'); 
const async = require('asyncawait/async'); 
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const common = require('anybet-common'); 
const exception = common.exceptions('WEB'); 
const logger = require('anybet-logging')("WEB");

const middleTier = require('./util/middleTier'); 
const config = require('./config'); 

require('dotenv').config();


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

function applyCorsHeaders(response) {
    response.setHeader('Access-Control-Allow-Origin', config.allowedOrigins);
    response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Custom-Header');
    response.setHeader("Access-Control-Allow-Headers", "authtoken, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
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

function logRequestStart(callTitle, request) {
    let text = callTitle; 
    let qstringParams = ""; //getRequestParamsAsString(request.query); 
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
    app.use(bodyParser.json());
    app.use(bodyParser());

    addOptionsCall(app, '/');
    addOptionsCall(app, '/providers');
    addOptionsCall(app, '/events');
    addOptionsCall(app, '/events/pending');
    addOptionsCall(app, '/bets');

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

    //OK
    app.get('/providers', async((req, res) => {
        executeCall('GET /providers', req, res, (context) => {
            return await(middleTier.getAcceptedProviders(context)); 
        });
    })); 

    //OK
    app.get('/events', async((req, res) => {
        executeCall('GET /events', req, res, (context) => {
            return await(middleTier.getAllEvents(context)); 
        });
    })); 

    //OK
    app.get('/events/pending', async((req, res) => {
        executeCall('GET /events/pending', req, res, (context) => {
            return await(middleTier.getPendingEvents(context)); 
        });
    })); 

    //OK
    app.get('/events/:eventid', async((req, res) => {
        const eventId = req.params.eventid;
        const relUrl = `/events/${eventId}`;
        addOptionsCall(app, relUrl);
        
        executeCall(`GET ${relUrl}`, req, res, (context) => {
            return await(middleTier.getEventDetails(context, eventId)); 
        });
    })); 

    //OK
    app.post('/events', async((req, res) => {
        executeCall(`POST /events/`, req, res, (context) => {
            return await(middleTier.addEvent(context, context.body.providerAddress, context.body.providerEventId, context.body.minimumBet)); 
        });
    })); 

    app.get('/bets', async((req, res) => {
        executeCall(`GET /bets/`, req, res, (context) => {
            const userAddress = req.query.userAddress;
            const eventId = req.query.eventId;
            
            return await(middleTier.getBets(context, eventId, userAddress)); 
        });
    })); 
    
    app.post('/bets', async((req, res) => {
        executeCall(`POST /bets/`, req, res, (context) => {
            const betId = req.body.betId;
            const userAddress = req.body.userAddress;
            const eventId = req.body.eventId; 
            const outcome = parseInt(req.body.outcome); 
            const amount = parseInt(req.body.amount); 

            return await(middleTier.placeBet(context, betId, userAddress, eventId, outcome, amount)); 
        });
    }));

    middleTier.start(); 

    const httpPort = 8084; 
    app.listen(httpPort, () => console.log('anybet listening on port ' + httpPort));
}


runWebServer();