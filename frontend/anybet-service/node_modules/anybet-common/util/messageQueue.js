'use strict';

const async = require('asyncawait/async');
const await = require('asyncawait/await');
const exception = require("./exceptions")('MSQ');

/** ===============================================================================================
 * @name MessageQueue - improved version 
 * @description Queues messages for processing by timer 
 * 
 * options: 
 *  async: don't wait for an element to finish processing, before trying to process the next one
 *      default: false
 *  runFirst: run immediately upon starting (don't wait for interval first) 
 *      default: false
 * 
 * construct queue with processing function 
 *      var queue = messageQueue.create((i) => { console.log(i.id); }); 
 * 
 * add messages with push 
 *      queue.push({id: 1}); 
 * 
 * clear the queue with clear 
 *      queue.clear(); 
 * 
 * start the queue and give it a timed interval for processing runs
 *      queue.start(500);   * processes queue every 500 ms
 * 
 * stop it whenever 
 *      queue.stop(); 
 * 
 * @author John R. Kosinski
 * 13 Mar 2018
*/
function MessageQueue(processFunc, options) {
    const _this = this;
    const _processFunc = processFunc;
    const _async = false;
    const _runFirst = false;

    let _queue = [];
    let _intHandle = null;
    let _stopWhenClear = false;
    let _started = false;
    let _stopped = false;
    let _timerFunc = null;
    let _interval = 0;

    /**  
     * @description safely pops the first item from queue
     * 
     * @returns {*} popped item 
     */
    const /*any*/ popQueue = () => {
        let data = _queue.splice(0, 1);
        return (data && data.length) ? data[0] : null;
    };

    /**  
     * @description resumes processing after having been paused  
     */
    const resume = () => {
        exception.try(() => {
            if (_started && !_intHandle) {
                if (_runFirst) 
                    timerFunc(); 
                else
                    _intHandle = setTimeout(timerFunc, _interval);
            }
        });
    };

    /**  
     * @description constructor 
     */
    const ctor = (processFunc, options) => {
        exception.try(() => {

            if (options) {
                if (options.async)
                    _async = options.async;
                if (options.runFirst)
                    _runFirst = options.runFirst;
            }
        });
    };

    /**  
     * @description safely pushes new item onto queue 
     */
    const pushQueue = (data) => {
        _queue.push(data);
    };

    /**   
     * @description handles the running through the queue and the processing of the elements, while the 
     * queue is running
     */
    const timerFunc = async(() => {
        exception.try(() => {

            while (_queue.length) {
                let data = popQueue();

                //if stopped or paused, don't run again 
                if (_stopped) 
                    break;

                //process sync or async 
                if (data && _processFunc) {
                    if (!_async)
                        await(_processFunc(data));
                    else
                        _processFunc(data);
                }
            }

            if (!_stopped) {

                //stop when clear, if flag is set 
                if (_stopWhenClear) {
                    if (_queue.length === 0)
                        _this.stop();
                }
                else {

                    //pause timer when nothing to process
                    if (!_queue.length)
                        _intHandle = null; 
                    else 
                        resume();
                }
            }
        });
    });


    //PROPERTY GETTERS
    /*bool*/ _this.isStarted = () => { return _started; };
    /*bool*/ _this.isRunning = () => { return _started && !_stopped; };

    /**  
     * @description push an item onto queue for processing on next run 
     * 
     * @param {*} data
     *  any value or object 
     */
    this.push = (data) => {
        pushQueue(data);
        resume();
    };

    /**  
     * @description starts a timer running on the given interval, to process items in queue
     * 
     * @param {int} interval
     *  interval in ms 
     */
    this.start = (interval) => {
        exception.try(() => {
            _started = true;
            _interval = interval;
            
            resume();
        });
    };

    /**  
     * @description stops the timer running to process queue
     */
    this.stop = () => {
        if (_intHandle) {
            clearInterval(_intHandle);
            _intHandle = null;
            _started = false;
            _stopped = true;
        }
    };

    /**  
     * @description stops the timer running to process queue, but flushes out (processes) all current pending 
     * elements first 
     * 
     * @param {int} waitMs
     *  an optional number of milliseconds to wait after rechecking the queue, before disposing
     */
    this.flushAndStop = (waitMs) => {
        const clear = () => {            
            _stopWhenClear = true;
            resume();
        };
        if (waitMs) {
            setTimeout(() => {
                clear();
            }, waitMs); 
        }
        else    
            clear();
    };

    ctor(processFunc, options);
}

module.exports = {
    create: (processFunc, options) => { return new MessageQueue(processFunc, options); }
};