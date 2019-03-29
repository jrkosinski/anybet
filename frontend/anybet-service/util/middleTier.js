'use strict'

const await = require('asyncawait/await'); 
const async = require('asyncawait/async'); 

const common = require('anybet-common'); 
const enums = common.enums;
const dates = common.datesUnix;
const exception = common.exceptions('MID'); 
const logger = require('anybet-logging')("MID");

const dataAccess = require('./dataAccess'); 
const contract = require('./contract.js'); 

const _events = { cached: 0, data: {} };
const _bets = { }; 

const refreshEventsFromContract = async(() => {
    exception.try(() => {
        if (dates.secondsSinceDate(_events.cached) >= 60) {
            const events = await(contract.getAllEvents()); 
            _events.data = {}; 

            for (let n=0; n<events.length; n++) {
                _events.data[events[n]] = { id: events[n]}; 
            }

            await(dataAccess.syncEvents(_events.data)); 
        }
    });
});

// ---- 

const start = async(() => {
    await(refreshEventsFromContract()); 
});

const getAcceptedProviders = async((context) => {
    return await(dataAccess.getAcceptedProviders());
});

//TODO: cache
const /*event{}*/ getAllEvents = async((context) => {
    return exception.try(() => {

        //recache? 
        await(refreshEventsFromContract()); 
        const output = await(dataAccess.getAllEvents()); 

        return { status: 200, data: output }; 
    });
});

//TODO: cache
const /*event{}*/ getPendingEvents = async((context) => {
    return exception.try(() => {

        //recache? 
        await(refreshEventsFromContract()); 
        const output = await(dataAccess.getPendingEvents()); 
        
        return { status: 200, data: data }; 
    });
});

const /*event*/ getEventDetails = async((context, eventId) => {
    return exception.try(() => {
        
    });
});

const /*event*/ addEvent = async((context, name, options, minimumBet, date) => {
    return exception.try(() => {
        
    });
});

//TODO: cache
const /*bet{}*/ getBets = async((context, eventId, userAddress) => {
    return exception.try(() => {
        //return await(dataAccess.getUserBets(userAddress, eventId));
    });
});

//TODO: have to have special handling for this; verify that bet was actually placed in contract
const placeBet = async((context, betId, userAddress, eventId, outcome, amount) => {
    return exception.try(() => {
        const bet = {
            id: betId,
            userAddress: userAddress,
            eventId: eventId,
            outcome: outcome,
            amount: amount
        };
        const data = await(dataAccess.placeBet(bet));
        return { status: 200, data: data }; 
    });
});


module.exports = {
    start, 

    getAcceptedProviders,
    getAllEvents,
    getPendingEvents,
    getEventDetails,
    addEvent,
    getBets,
    placeBet,
    getBetTotals
}