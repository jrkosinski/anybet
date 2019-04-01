'use strict'

const await = require('asyncawait/await'); 
const async = require('asyncawait/async'); 

const common = require('anybet-common'); 
const enums = common.enums;
const exception = common.exceptions('DATA'); 
const logger = require('anybet-logging')("DATA");

/* provider: {
    id: <string>
}*/
const _providers = { }; 
/* event: {
    id:                 <string>
    providerAddress:    <string> 
	providerEventId:    <string>
	name:               <string>
	date:               <number>
	minBetAmount:       <number>
	state:              <number>
	options:            <string[]>
    outcome:            <number>
    cacheTimestamp:     <number> 
}*/
const _events = { };
/* bet: {
    id:             <string> 
    userAddress:    <string> 
    eventId:        <string> 
	amount:         <number>
    outcome:        <number>
    paid:           <number>
} */
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
            await(syncEvent(events[id]));
        }
    });
});

const syncEvent = async((event) => {
    exception.try(() => {
        if (!_events[event.id]) {
            //add
            _events[event.id] = event; 
        }
        else {
            //update 
            const properties = [ 'state', 'outcome', 'options', 'name', 'minBetAmount', 'date', 'providerAddress', 'providerEventId' ]
            for (let n=0; n<properties.length; n++) {
                const p = properties[n]; 
                if (!common.types.isUndefinedOrNull(event[p])) {
                    _events[event.id][p] = event[p]; 
                }
            }
        }
    }); 
}); 

const syncBets = async((bets) => {
    exception.try(() => {

        //delete 
        for (let id in _bets) {
            if (!bets[id]) {
                delete _bets[id]; 
            }
        }

        for (let id in bets) {
            if (!_bets[id]) {
                //add
                _bets[id] = bets[id]; 
            }
            else {
                //update 
                const properties = [ 'paid' ]
                for (let n=0; n<properties.length; n++) {
                    const p = properties[n]; 
                    if (!common.types.isUndefinedOrNull(bets[id][p])) {
                        _bets[id][p] = bets[id][p]; 
                    }
                }
            }
        }
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
    syncEvent,
    syncBets
}