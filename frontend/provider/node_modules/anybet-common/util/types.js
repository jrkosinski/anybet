'use strict'; 

/** =============================================================================================== 
 * @name types 
 * @description Equality comparisons and related utilities.
 * 
 * @author John R. Kosinski
 * @date 13 Jan 2018
 */

/**
 * @description returns true if the given value is not undefined
 * @returns {bool}
 */
/*bool*/ function isDefined(v) {
    return ( typeof v !== 'undefined');
}

/**
 * @description returns true if the given value is null
 * @returns {bool}
 */
/*bool*/ function isNull(v) {
    return v === null;
}

/**
 * @description returns true if the given value is a function
 * @returns {bool}
 */
/*bool*/ function isFunction(v) {
    let getType = {};
    return v && getType.toString.call(v) === '[object Function]';
}

/**
 * @description returns true if the given value is an array
 * @returns {bool}
 */
/*bool*/ function isArray(v) {
    return Array.isArray(v);
}

/**
 * @description returns true if the given value is an object type 
 * @returns {bool}
 */
/*bool*/ function isObject(v) {  
    if (v === null) { return false;}
    return ( (typeof v === 'function') || (typeof v === 'object') );
}

/**
 * @description attempts to convert the given value to an integer, returning 0 by default
 * @returns {int}
 */
/*int*/ function tryParseInt(v) {
     let output = 0;
     if(isDefined(v) && !isNull(v)) {
         v = v.toString();
         if(v.length > 0) {
             if (!isNaN(v)) {
                 output = parseInt(v);
             }
         }
     }
     return output;
}

/**
 * @description attempts to convert the given value to a float, returning 0 by default
 * @returns {float}
 */
/*float*/ function tryParseFloat(v) {
     let output = 0;
     if(isDefined(v) && !isNull(v)) {
         v = v.toString();
         if(v.length > 0) {
             if (!isNaN(v)) {
                 output = parseFloat(v);
             }
         }
     }
     return output;
}


module.exports = {
    isDefined: isDefined,
    isUndefined: (v) => { return !isDefined(v);},
    isNull: isNull, 
    isUndefinedOrNull: (v) => { return !isDefined(v) || isNull(v); },
    isFunction : isFunction,
    isArray: isArray,
    isObject: isObject,
	tryParseInt: tryParseInt,
	tryParseFloat: tryParseFloat
}