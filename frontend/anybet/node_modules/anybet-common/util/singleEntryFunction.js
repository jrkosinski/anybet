'use strict'; 

const async = require("asyncawait/async");
const await = require("asyncawait/await");

/** ===============================================================================================
 * @name SingleEntryFunction 
 * @description Encapsulates a function that cannot be called while it's already executing. 
 * 
 * USAGE: 
 * 
 * change this: 
 *      let _executing = false; 
 * 
 *      this.myFunction = (a, b) {
 *          if (!_executing) {
 *              _executing = true; 
 * 
 *              //... execution ... 
 *              _executing = false;
 *      }
 * 
 * into this: 
 *      this.myFunction = new SingleEntryFunction((a, b) => {
 *          //... execution... 
 *      }).function;
 * 
 * (takes a limited number of parameters) 
 * 
 * @author John R. Kosinski
 * @date 23 Jan 2018
 */
function SingleEntryFunction(f) {
    let _calling = false; 
    const _function = f;

    /**
     * @description returns an async function to call and await the underlying function
     * @returns {async function}
     */
    this.functionAsync = async((a1, a2, a3, a4, a5, a6, a7) => {
        if (!_calling) {
            _calling = true; 

            const output = await(_function(a1, a2, a3, a4, a5, a6, a7)); 
            _calling = false;
            return output; 
        }
    }); 

    /**
     * @description returns a normal (non-async) function to call the underlying function
     * @returns {function}
     */
    this.function = (a1, a2, a3, a4, a5, a6, a7) => {
        if (!_calling) {
            _calling = true; 

            const output =  _function(a1, a2, a3, a4, a5, a6, a7); 
            _calling = false;
            return output; 
        }
    }; 
}

module.exports = SingleEntryFunction
