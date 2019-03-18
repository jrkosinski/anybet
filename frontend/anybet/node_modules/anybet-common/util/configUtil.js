'use strict'; 

const strings = require('./strings'); 

// used for getTimeIntervalSetting
const _timeIntervals = { ms: 1, s: 1000, m: 60000, h: 3600000, d: 86400000 };

/** ===============================================================================================
 * @name configUtil 
 * @description Utilities for reading and writing application config settings.
 * 
 * @author John R. Kosinski
 * @date 13 Jan 2018
 */
const profile = (process.env.PROFILE || ''); 

/** 
 * @description creates an enum with the given names and values. 
 * 
 * args
 *  elementNames: array of unique strings
 *  elementValues: (optional) if not passed, values are same as names 
 *
 * example: the call makeEnum(['one', 'two', 'three']) returns an object in the form: 
 *  {
 *      one: 'one',
 *      two: 'two',
 *      three: 'three'
 *  }
 * 
 * @returns {json} json object in the form 
 * {
 *     <elementNames[0]>: <elementValues[0]>,
 *     <elementNames[1]>: <elementValues[1]>,
 *     <elementNames[n]>: <elementValues[n]>
 *     ...
 * }
 */ 
/*array*/ function makeEnum(elementNames, elementValues){
    let output = {};
    if (!elementValues)
        elementValues = elementNames; 

    for(var n=0; n<elementNames.length; n++){
        output[elementNames[n]] = elementValues[n];
    }
    return output; 
}

/** 
 * @description gets the given setting value, or the given default
 *
 * args
 *  key: the key of the desired setting
 *  defaultValue: the value to return if the setting isn't found 
 * 
 * @returns {string} 
/*string*/ function getSetting(key, defaultValue){
    if (profile.length)
        key += '_' + profile;
    
    let value = process.env[key]; 
    if (value === null || value === undefined){
        value = defaultValue;
    }

    return value; 
}

 /** 
 * @description gets the given setting value, or the given default
 *
 * args
 *  key: the key of the desired setting
 *  defaultValue: the value to return if the setting isn't found 
 * 
 * @returns {bool} 
 */ 
/*bool*/ function getBooleanSetting(key, defaultValue){
    let value = getSetting(key, defaultValue ? 'true' : 'false'); 
    return (value == 'true'); 
}

/** 
* @description gets the given setting value as integer, or the given default
*
* args
*  key: the key of the desired setting
*  defaultValue: the value to return if the setting isn't found 
* 
* @returns {int} 
*/ 
/*int*/ function getIntegerSetting(key, defaultValue) {
    const value = getSetting(key, null); 
    if (!value) {
        return defaultValue;
    }

    return parseInt(value);
}

/** 
* @description gets the given setting value as floating-point, or the given default
*
* args
*  key: the key of the desired setting
*  defaultValue: the value to return if the setting isn't found 
* 
* @returns {float} 
*/ 
/*int*/ function getNumericSetting(key, defaultValue) {
    const value = getSetting(key, null); 
    if (!value) {
        return defaultValue;
    }

    return parseFloat(value);
}

 /** 
 * @description gets an array from the given setting value, or the given default
 *
 * args
 *  key: the key of the desired setting
 *  defaultValue: the value to return if the setting isn't found 
 *  delimiter: the delimiter of array elements (',' is the default) 
 * 
 * @returns {array} 
 */ 
/*any[]*/ function getArraySetting(key, defaultValue, delimiter){
    if (!delimiter)
        delimiter = ',';
    let value = getSetting(key, '');  
    
    if (value && value.length) {
        return value.split(delimiter); 
    }

    let array = defaultValue.split(delimiter);
    return array;
}

 /** 
 * @description gets the value of the logging level setting 
 *
 * args
 *  key: the key of the logging level setting
 *  defaultValue: the value to return if the setting isn't found 
 * 
 * @returns {string[]}
 */ 
/*string[]*/ function getLoggingLevel(key, defaultValue) {
    let sValue = getSetting(key, defaultValue);
    let output = sValue.trim().toLowerCase();

    if (sValue != 'all' && sValue != 'none') {
        output = output.split(',');
        for(var i=0; i<output.length; i++)
            output[i] = output[i].trim();
    }

    return output; 
}

 /** 
 * @description gets the value of the setting, interpreted as a time interval. 
 *
 * value values consist of an integer, followed by a time interval type (with no spaces) 
 * valid time interval types are: 
 *  - m  (minutes)
 *  - s  (seconds)
 *  - h  (hours)
 *  - ms (milliseconds)
 *  - d  (days)
 *
 * if the interval type is omitted, it's assumed to be milliseconds 
 * examples: 
 *  5ms         (5 milliseconds)
 *  1d          (1 day)
 *  3h          (3 hours)
 *  5m          (5 minutes)
 *
 * args
 *  key: the key of the logging level setting
 *  defaultValue: the value to return if the setting isn't found (should be given as number of ms)
 * 
 * returns: int
 */ 
/*int*/ function getTimeIntervalSetting(key, defaultValue) {
    let val = getSetting(key, defaultValue); 
    let output = defaultValue;

    if (val) {        
        val = val.trim().toLowerCase();

        for (let int in _timeIntervals) {
            if (val.endsWith(int)) {
                let multiplier = _timeIntervals[int]; 
                val = val.substring(0, val.length - int.length); 

                if (strings.isNumeric(val)) {
                    let nVal = parseInt(val); 
                    output = nVal * multiplier;
                    break;
                }
            }
        }
    }

    return output; 
}

module.exports = {
    makeEnum,
    getSetting,
    getBooleanSetting,
    getIntegerSetting,
    getNumericSetting,
    getArraySetting,
    getLoggingLevel,
    getTimeIntervalSetting
};