'use strict';

/** =====================================================================================================
 * @name evs-common
 * @description common & generic utilities 
 * @author John R. Kosinski
// 24 Jan 2018
 */

const config = require('./config');
const dates = require('./util/dates');
const datesUnix = require('./util/datesUnix');
const async = require('asyncawait/async');
const await = require('asyncawait/await');

/** 
 * @description waits a given number of milliseconds
 * @param {int} ms number of milliseconds to wait 
 * @returns {Promise}
 */
function wait(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve(true);}, ms);
    });
}

/** 
 * @description wraps the given function inside of a promise & returns a promise that resolves to the 
 *  return value of the given function. 
 * @param {*} func the lambda to wrap
 * @returns {Promise}
 */
function wrapInPromise(func){
    let promise = new Promise((resolve, reject) => {
        resolve(func);
    });
    return promise;
}

/** 
 * @description wraps the given async function inside of a promise & returns a promise that resolves to  
 *  the return value of the awaited given function. 
 * @param {*} asyncFunc 
 *  the async lambda to wrap 
 * @returns {Promise} 
 */
function wrapInPromiseAsync(asyncFunc){
    let promise = new Promise(async((resolve, reject) => {
        resolve(await(asyncFunc()));
    }));
    return promise;
}

/** 
 * @description patiently waits for a given condition to be true, checking the condition every given 
 *  interval. Optionally can timeout after a given number of seconds.
 * @param {*} conditionFunction 
 *  lambda that returns a value when true, the promise resolves 
 * @param {*} intervalSeconds 
 *  number of seconds between checking the condition function
 * @param {*} timeoutSeconds 
 *  optional number of seconds before waiting times out 
 * @returns {Promise} resolves to true when the condition becomes true, false on timeout
 */
function waitForCondition(conditionFunction, intervalSeconds, timeoutSeconds) {
    return new Promise((resolve, reject) => {
        let timestamp = dates.getTimestamp();

        if (conditionFunction())
            resolve(true); 
        else {
            let id = setInterval(async(() => {
                if (conditionFunction()) {
                    clearInterval(id);
                    resolve(true);
                }
                let now = dates.getTimestamp();
                let diff = (now - timestamp)/1000;
                if (timeoutSeconds){
                    if (diff >= timeoutSeconds){
                        clearInterval(id);
                        resolve(false);
                    }                
                }
            }), intervalSeconds * 1000);
        }
    });
}


module.exports = {
    strings: require('./util/strings'),
    dates: dates,
    datesUnix: datesUnix,
    json: require('./util/json'),
    config: require('./util/configUtil'),
    enums: require('./util/enums'),
    fibonacci: require('./util/fibonacci'),
    types: require('./util/types'), 
    numbers: require('./util/numbers'),
    arrays: require('./util/arrays'),
    ws: require('./util/reconWs'),
    messageQueue: require('./util/messageQueue'),
    exceptions: (prefix) => { return require('./util/exceptions')(prefix); },
    Timer: require('./util/timer'),
    SingleEntryFunction: require('./util/singleEntryFunction'),
    LookupTable: require('./util/lookupTable'),

    wait: wait, 
    waitSeconds: (s) => { return wait(s * 1000);},
    waitForCondition: waitForCondition, 

    wrapInPromise : wrapInPromise,
    wrapInPromiseAsync : wrapInPromiseAsync
};

