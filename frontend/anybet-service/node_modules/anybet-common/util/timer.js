'use strict'; 

const async = require('asyncawait/async');
const await = require('asyncawait/await');

const dates = require('./dates'); 

/** =============================================================================================== 
 * @name Timer 
 * @description A generic timer class wrapping javascript setTimeout and clearTimeout
 * 
 * @author John R. Kosinski
 * @date 21 Apr 2018
 */
function Timer(intervalMs, callback) {
    const _this = this; 
    
    let _interval = intervalMs;    
    let _callback = callback;    
    let _startTimestamp = null; 
    let _stopTimestamp = null; 
    let _timerHandle = null; 
    let _awaitable = false;

    /**
     * @description 
     */
    const callCallback = async((runFirst) => {
        if (_awaitable) 
            await(_callback()); 
        else 
            _callback(); 
    });

    /**
     * @description 
     */
    const runOnce = async((runFirst) => {
        if (runFirst) {
            callCallback(); 
        }

        _timerHandle = setTimeout(async(() => {
            await(callCallback());

            if (_this.isRunning()) {
                runOnce(false); 
            }
        }), _interval); 
    }); 

    /**
     * @description  sets the callback function to be called on timer
     */
    this.setCallback = (callback) => {
        _callback = callback;
    }; 

    /**
     * @description  sets the number of ms to use as interval between calls
     */
    this.changeInterval = (ms) => {
        _interval = ms;
        if (_timerHandle) {
            clearTimeout(_timerHandle);
            runOnce(false); 
        }
    }; 

    /**
     * @description returns true if the timer has been started (and not yet stopped) 
     * @returns {bool}
     */
    /*bool*/ this.isRunning = () => {
        return (_timerHandle ? true: false); 
    }; 

    /**
     * @description gets the number of milliseconds from the last start to the most recent  
     * stop (if stopped; otherwise the number of milliseconds from start til now) 
     * @returns {int}
     */
    /*int*/ this.getRunDuration = () => {
        let output = 0; 
        if (_startTimestamp) {
            let stopTimestamp = _stopTimestamp; 
            if (!stopTimestamp) 
                stopTimestamp = dates.getTimestamp(); 
            output = stopTimestamp - _startTimestamp;
        }

        return output; 
    }; 

    /**
     * @description starts the timer running \
     * @param {function} callback
     *  the function that will be called on every iteration 
     * @param {bool} runFirst
     *  if true, the callback will be called as soon as start() is called, and then 
     *      again on each iteration. If false, the first call of the callback will occur on the 
     *      first iteration (after the interval of time has passed once) i.e., there will be a 
     *      delay before the first call of the callback.
     * @returns {bool}
     */
    /*bool*/ this.start = (callback, runFirst) => {
        _awaitable = false;
        if (!_timerHandle) {
            if (callback)
                _callback = callback; 

            runOnce(runFirst);

            _startTimestamp = dates.getTimestamp(); 
            _stopTimestamp = null; 

            return true;
        }
        return false;
    }; 

    /**
     * @description starts the timer running when the callback given is an async() function, and the 
     * function should be await()ed each time it's called by the timer. 
     * @returns {bool}
     */
    /*bool*/ this.startAsync = (callback, runFirst) => {
        _awaitable = true;
        if (!_timerHandle) {
            if (callback)
                _callback = callback; 

            runOnce(runFirst); 
            
            _startTimestamp = dates.getTimestamp(); 
            _stopTimestamp = null; 

            return true;
        }
        return false;
    };

    /**
     * @description stops the timer, if started. 
     * @returns {int}
     *  number of milliseconds between most recent start and stop
     */
    /*int*/ this.stop = () => {
        if (_timerHandle) {
            clearTimeout(_timerHandle); 
            _timerHandle = null; 
            _stopTimestamp = dates.getTimestamp();

            return _this.getRunDuration();
        }
        return 0;
    }; 
}

module.exports = Timer;