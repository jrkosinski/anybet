'use strict';

/** ======================================================================================================
 * @name exceptions 
 * @description Standard handling for exceptions. 
 * 
 * @author John R. Kosinski
 * @date 3 Oct 2017
 */
const async = require("asyncawait/async");
const await = require("asyncawait/await");
const config = require('../config');


module.exports = function excepUtil(logPrefix) {
    const logger = require('anybet-logging')(logPrefix); 

    function ExcepUtil() {
        const _this = this; 

        /** 
         * @description wraps the given expression in a try/catch, and provides standard 
         * handling for any errors.
         * 
         * @param {function} expr
         * @param {json} options
         *  {
         *      defaultValue: null,
         *      onError: () => {},
         *      functionName: ''
         *  }
         * @returns {*} return value of given expression
         */
        this.try = (expr, options) => {
            try{
                return expr();
            }
            catch(err){
                _this.handleError(err);
                if (options && options.onError)
                    return options.onError(err);

                return options ? options.defaultValue : null;
            }
            finally {                
                if (options && options.finally) 
                    return options.finally(); 
            }
        };

        /** 
         * @description wraps the given expression in a try/catch, and provides standard 
         * handling for any errors.
         *
         * @param {function} expr
         * @param {json} options
         *  {
         *      defaultValue: null,
         *      onError: () => {},
         *      functionName: ''
         *  }
         * @returns {*} return value of given expression
         */
        this.tryAsync = async((expr, options) => {
            try{
                return await(expr()); 
            }
            catch(err){
                _this.handleError(err);
                if (options && options.onError)
                    return options.onError(err);
                return options ? options.defaultValue : null;
            }
            finally {                
                if (options && options.finally) 
                    return options.finally(); 
            }
        });

        /** 
         * @description provides standard handling for any errors.
         * @param {Error} err
         * @param {string} functionName
         */
        this.handleError = (err, functionName) => {
            let prefix = (functionName && functionName.length ? ' <' + functionName + '> ' : '');
            logger.error(prefix + JSON.stringify(err) + ' ' + err);
            if (err.stack)
                console.log(err.stack);
        }
    }

    return new ExcepUtil();
};