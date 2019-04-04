'use strict'

const await = require('asyncawait/await'); 
const async = require('asyncawait/async'); 
const ethUnits = require('ethereumjs-units'); 

const common = require('anybet-common'); 
const enums = common.enums;
const dates = common.datesUnix;
const exception = common.exceptions('MID'); 
const logger = require('anybet-logging')("MID");

const dataAccess = require('./dataAccess'); 
const contract = require('./contract.js'); 

const EVENT_CACHE_EXPIRE_MINUTES = 60; 

const _events = { cacheTimestamp: 1, data: {} };
const _bets = { }; 

const parseIntNull = (n) => {
    if (common.types.isUndefinedOrNull(n)) 
        return null; 
    return parseInt(n); 
}; 

const conversions = {
    events: {
        contractToDb: (obj) => {
            let output = null; 
            if (obj) {
                output = {
                    id: obj.eventId, 
                    providerAddress:obj.providerAddress,
                    providerEventId:obj.providerEventId,
                    name:obj.name,
                    date:parseIntNull(obj.date),
                    minBetAmount:parseIntNull(obj.minBetAmount),
                    state:parseIntNull(obj.state),
                    options: [],
                    outcome:parseIntNull(obj.outcome),
                }; 
                if (obj.options) {
                    output.options = obj.options.split("|"); 
                }
            }
            return output; 
        }, 
    }, 
    bets: {
        contractToDb: (obj) => {
            const output = {
                id: obj.id,
                userAddress: obj.user,
                eventId: obj.eventId,
                amount: parseIntNull(obj.amount),
                outcome: parseIntNull(obj.option),
                paid: parseIntNull(obj.paid) ? true : false
            }; 

            return output; 
        },
    }
}; 

const refreshEventsFromContract = async(() => {
    exception.try(() => {
        //TODO: store this as setting 
        if (dates.minutesSinceTimestamp(_events.cacheTimestamp) >= EVENT_CACHE_EXPIRE_MINUTES) {
            const allEvents = await(contract.getAllEvents());
            const pendingEvents = await(contract.getPendingEvents());  
            _events.data = {}; 

            if (allEvents) {
                for (let n=0; n<allEvents.length; n++) {
                    const event =  { id: allEvents[n]}
                    _events.data[allEvents[n]] = event; 
                    if (common.arrays.exists(pendingEvents, (e) => { return (e === event.id) })) {
                        event.state = common.enums.eventState.pending;
                    }
                }
            }

            _events.cacheTimestamp = dates.getTimestamp(); 
            await(dataAccess.syncEvents(_events.data)); 
        }
    });
});

const eventHasDetails = (event) => {
    return (event && event.providerAddress && event.providerEventId); 
}; 

// ---- 

const start = async((onFinished) => {
    await(refreshEventsFromContract()); 
    if (onFinished) {
        onFinished(); 
    }
});

const getContractInfo = async((context) => {
    return {
        status: 200, 
        content: {
            abi: contract.abi, 
            address: contract.address
        }
    }; 
});

const getAcceptedProviders = async((context) => {
    const data = await(dataAccess.getAcceptedProviders());
    return { status:200, content: data }; 
});

//TODO: cache
const /*event{}*/ getAllEvents = async((context) => {
    return exception.try(() => {

        //recache? 
        await(refreshEventsFromContract()); 
        const output = await(dataAccess.getAllEvents()); 

        return { status: 200, content: output }; 
    });
});

//TODO: cache
const /*event{}*/ getPendingEvents = async((context) => {
    return exception.try(() => {

        //recache? 
        await(refreshEventsFromContract()); 
        const output = await(dataAccess.getPendingEvents()); 
        
        return { status: 200, content: output }; 
    });
});

const /*event*/ getEventDetails = async((context, eventId) => {
    return exception.try(() => {
        let needsRefresh = false; 
        let output = null; 
        
        //do we have it in cache? 
        const cachedEvent = _events.data[eventId]; 

        if (cachedEvent) {
            //if cached, does it have details? 
            if (!eventHasDetails(cachedEvent)) {
                needsRefresh = true;
            }
            else {
                //or is it expired?
                if (dates.minutesSinceTimestamp(cachedEvent.cacheTimestamp) >= EVENT_CACHE_EXPIRE_MINUTES) {
                    needsRefresh = true;
                }
            }
        }
        else {
            needsRefresh = true;
        }

        //refresh from contract if needed
        if (needsRefresh) {
            
            //get from contract 
            const contractEvent = await(contract.getEventDetails(eventId)); 
            if (contractEvent) {
                output = conversions.events.contractToDb(contractEvent); 

                //update cache 
                output.cacheTimestamp = dates.getTimestamp(); 
                _events.data[eventId] = output; 

                //update database
                dataAccess.syncEvent(output); 
            }
        }
        else {
            output = cachedEvent;
        }

        return { status:200, content: output }; 
    });
});

const /*event*/ addEvent = async((context, providerAddress, providerEventId, minimumBet) => {
    return exception.try(() => {
        let output = null; 

        //attempt to add to contract 
        const minBet = ethUnits.convert(minimumBet, 'wei', 'eth'); 
        const eventId = await(contract.addEvent(providerAddress, providerEventId, minBet)); 
        if (eventId) {
            //if successful add, add to cache & DB 
            output = await(getEventDetails(context, eventId)); 
        }

        return { status:200, content: output }; 
    });
});

//TODO: cache
const /*bet{}*/ getBets = async((context, eventId, userAddress) => {
    return exception.try(() => {
        //return await(dataAccess.getUserBets(userAddress, eventId));
    });
});

//TODO: have to have special handling for this; verify that bet was actually placed in contract
const placeBet = async((context, userAddress, eventId, outcome, amount) => {
    return exception.try(() => {
        const betId = 'xxxxxxx'; 
        const bet = {
            id: betId,
            userAddress: userAddress,
            eventId: eventId,
            outcome: outcome,
            amount: ethUnits.convert(amount, 'eth', 'wei')
        };

        const data = await(dataAccess.placeBet(bet));
        return { status: 200, content: data }; 
    });
});

const getBetTotals = async((context) => {
    return exception.try(() => {

    });
});


module.exports = {
    start, 

    getContractInfo,
    getAcceptedProviders,
    getAllEvents,
    getPendingEvents,
    getEventDetails,
    addEvent,
    getBets,
    placeBet,
    getBetTotals
}