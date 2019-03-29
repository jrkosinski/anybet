const WebSocket= require('ws')
, EventEmitter = require('events').EventEmitter
, util = require('util')

function ReconWs(uri, interval) {
    this.uri = uri;
    this.interval = interval || 5e3;
    this.connected = false;
    this.connect();
}

util.inherits(ReconWs, EventEmitter)

ReconWs.prototype.connect = function() {
    this.ws = new WebSocket(this.uri);
    this.ws.on('open', this.wsOpen.bind(this));
    this.ws.on('message', this.wsMessage.bind(this));
    this.ws.on('close', this.wsClose.bind(this));
    this.ws.on('error', this.wsError.bind(this));
}

ReconWs.prototype.wsOpen = function() {
    this.connected = true;
    this.emit('open');
}

ReconWs.prototype.wsClose = function() {
    this.connected = false;
    this.emit('close');
    this.retry();
}

ReconWs.prototype.retry = function() {
    //if (!this.disposed) {
        this.timerHandle = setTimeout(function() {
            this.connect();
        }.bind(this), this.interval);
    //}
}

ReconWs.prototype.wsError = function(err) {
    this.connected = false;
    this.retry();
}

ReconWs.prototype.wsMessage = function(msg) {
    this.emit('message', msg);
}

ReconWs.prototype.send = function() {
    this.ws.send.apply(this.ws, arguments);
}

ReconWs.prototype.close = function() {
    this.ws.close(); 
}

ReconWs.prototype.dispose = function() {
    this.ws.close(); 
    ///if (this.timerHandle){
    //    clearInterval(this.timerHandle); 
    //}
    this.disposed = true;
}

module.exports = ReconWs
