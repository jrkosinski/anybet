'use strict'

const await = require('asyncawait/await'); 
const async = require('asyncawait/async'); 

const common = require('anybet-common'); 
const enums = common.enums;
const exception = common.exceptions('DATA'); 
const logger = require('anybet-logging')("DATA");

const _providers = { }; 
const _events = { };
const _bets = { }; 

const /*provider{}*/ getAcceptedProviders = async(() => {
    return _providers;
});

const /*event{}*/ getAllEvents = async(() => {
    return exception.try(() => {
        return _events;
    });
});

const /*event{}*/ getPendingEvents = async(() => {
    return exception.try(() => {
        const output = { }; 
        for (let id in _events) {
            const evt = _events[id]; 
            if (evt.state === enums.eventState.pending) {
                output[id] = evt; 
            }
        }

        return output; 
    });
});

const /*event*/ addEvent = async((event) => {
    _events[event.id] = event;
});

const /*event*/ getEventDetails = async(() => {

});

const /*bet{}*/ getEventBets = async((eventId) => {
    return exception.try(() => {
        return exception.try(() => {
            const output = { }; 
            
            for (let id in _bets) {
                const bet = _bets[id]; 
                if (bet.eventId === eventId) {
                    output[id] = bet;
                }
            }
            return output; 
        });
    });
});

const /*bet{}*/ getUserBets = async((userAddress, eventId) => {
    return exception.try(() => {
        const output = { }; 
        
        for (let id in _bets) {
            const bet = _bets[id]; 
            if (bet.userAddress === userAddress && bet.eventId === eventId) {
                output[id] = bet;
            }
        }
        return output; 
    });
});

const placeBet = async((bet) => {
    return exception.try(() => {
        
    });
});

const syncEvents = async((events) => {
    exception.try(() => {

        //delete 
        for (let id in _events) {
            if (!events[id]) {
                delete _events[id]; 
            }
        }

        for (let id in events) {
            if (!_events[id]) {
                //add
                _events[id] = events[id]; 
            }
            else {
                //update 
                const properties = [ 'state', 'outcome', 'options', 'name', 'minBetAmount', 'date', 'providerAddress', 'providerEventId' ]
                for (let n=0; n<properties.length; n++) {
                    const p = properties[n]; 
                    if (events[id][p]) {
                        _events[id][p] = events[id][p]; 
                    }
                }
            }
        }
    });
});

const syncBets = async((bets) => {
    exception.try(() => {
        
    });
}); 


module.exports = {
    getAcceptedProviders,
    getAllEvents,
    getPendingEvents,
    addEvent,
    getEventDetails,
    getEventBets,
    getUserBets,
    placeBet, 

    syncEvents,
    syncBets
}