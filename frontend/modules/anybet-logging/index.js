'use strict';

// ===============================================================================================
// logger - for logging.
// 
// John R. Kosinski
// 4 Oct 2017

const config = require('./config');
const winston = require('winston');
const WinstonCloudWatch = require('winston-cloudwatch');
const WebSocket = require('ws');
const https = require('https'); 
const fs = require('fs'); 

var _websocketOpened = false;
var _cloudWatchOpened = false;
var _wsClients = {};
var _winstonTransport = null;

openCloudwatch();
openWebSocket();

// values: 'ALL', 'NONE', or array of logType values. s
var loggingLevel = config.loggingLevel();

var _global = null;

var logType = {
    info: 'info',
    debug: 'debug',
    warn: 'warn',
    error: 'error'
};

module.exports = function logger(prefix) {

    function GlobalLogger() {
        var _this = this;

        var checkAwsLogDate = () => {
            if (_winstonTransport){
                if (_winstonTransport.date != getLogDateString(new Date())){
                    openCloudwatch(); 
                }
            }
        };

        this.log = function (prefix, s, type = logType.info) {
            var log = true;

            if (Array.isArray(loggingLevel)) {
                log = false;
                var found = loggingLevel.filter(function (i) { return (i === type || i === 'all'); });
                if (found && found.length)
                    log = true;
            }
            else {
                if (loggingLevel.toUpperCase() == 'ALL')
                    log = true;
                else if (loggingLevel.toUpperCase() == 'NONE')
                    log = false;
            }

            if (log) {
                var output = '[' + type + '] ' + prefix + ': ' + s;

                if (type === 'print')
                    output = ' . ' + s;
                //console.log(output);

                //log to winston cloudwatch
                if (config.logging.aws.enabled()) {
                    checkAwsLogDate(); 

                    try {
                        switch (type) {
                            case logType.info:
                                winston.info(output);
                                break;
                            case logType.warn:
                                winston.warn(output);
                                break;
                            case logType.debug:
                                winston.debug(output);
                                break;
                            case logType.error:
                                winston.error(output);
                                break;
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
                else
                    console.log(output);
                
                //log to websocket
                if (config.logging.websocket.enabled()) {
                    try {
                        for (var key in _wsClients) {
                            _wsClients[key].send(output);
                        }
                    } catch (e) { console.log(e); }
                }
            }

            return output; 
        };
    }

    function Logger(prefix) {
        var _this = this;

        this.logType = logType;

        if (!prefix)
            prefix = '';
        this.prefix = prefix;

        this.info = function (s) { return _global.log(_this.prefix, s, logType.info); }
        this.debug = function (s) { return _global.log(_this.prefix, s, logType.debug); }
        this.warn = function (s) { return _global.log(_this.prefix, s, logType.warn); }
        this.error = function (s) { return _global.log(_this.prefix, s, logType.error); }
        this.print = function(s) { return _global.log(_this.prefix, s, 'print'); }
    }

    if (!_global)
        _global = new GlobalLogger(prefix);

    return new Logger(prefix);
};

function getLogDateString(date){
    return date.getDate() + '-' + (Number.parseInt(date.getMonth())+1) + '-' + date.getFullYear() + ' [D-M-Y]'
}

function openCloudwatch() {
    try {
        if (!_cloudWatchOpened) {
            if (config.logging.aws.enabled()) {
                if (_winstonTransport)
                    winston.remove(_winstonTransport); 

                //TODO: move some of these settings to config (LOW)
                var currentDate = new Date();
                var dateString = getLogDateString(currentDate); 

                _winstonTransport = {
                    logGroupName: config.logging.logGroupName(),
                    logStreamName: config.logging.logStreamName() + '-' + dateString,
                    name: config.logging.logStreamName() + '-' + dateString,
                    createLogGroup: true,
                    createLogStream: true,
                    submissionInterval: 2000,
                    batchSize: 20,
                    awsRegion: config.logging.aws.region(),
                    awsAccessKeyId: config.logging.aws.apiKey(),
                    awsSecretKey: config.logging.aws.apiSecret(),
                    date : dateString
                }
                winston.add(WinstonCloudWatch, _winstonTransport);
            }
        }
    } catch (e) { console.log(e); }
}

function getClientKey() {
    return new Date().getTime();
}

function openWebSocket() {
    try {
        if (config.logging.websocket.enabled() && !_websocketOpened) {
            _websocketOpened = true;
            let wss = null; 

            if (config.useTls()) {  
                const server = https.createServer({
                    cert: fs.readFileSync('cert.pem'),
                    key: fs.readFileSync('privatekey.pem'),
                    autoAcceptConnections: true
                });

                wss = new WebSocket.Server({ 
                    server: server, 
                    autoAcceptConnections: true
                }); 

                server.listen(config.logging.websocket.port()); 
            } else {
                wss = new WebSocket.Server({ port: config.logging.websocket.port() });
            }             
            console.log('logging websocket open on port ' + config.logging.websocket.port()); 

            wss.on('connection', function connection(ws) {
                try {
                    ws.key = getClientKey();
                    _wsClients[ws.key] = ws;

                    ws.on('close', function incoming() {
                        try {
                            delete _wsClients[ws.key];
                        } catch (e) { console.log(e); }
                    });

                    ws.send('connected');
                } catch (e) { console.log(e); }
            });
        }
    } catch (e) { console.log(e); }
}
