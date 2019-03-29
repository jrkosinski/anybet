'use strict';

/** ===============================================================================================
 * @name json 
 * @description JSON-related utilities
 * 
 * @author John R. Kosinski
 * 11 Apr 2018
 */ 

const types = require('./types');

/** 
 * @description compares all available non-function properties between two objects
 * 
 * @param {object} obj1
 *  object to compare 
 * @param {object} obj2
 *  object to compare 
 * 
 * @returns {bool} true if all property values match between the two objects 
 */
/*bool*/ function compareObjects(obj1, obj2) {
    let output = false;
    if (obj1 && obj2) {
        const flat1 = flattenObject(obj1); 
        const flat2 = flattenObject(obj2); 

        const compare = (a, b) => {
            for (let p in a) {
                let val = a[p]; 
                if (b[p] !== a[p])
                    return false;
            }
            return true; 
        }; 

        return (compare(flat1, flat2) && compare(flat2, flat1));
    }
    else {
        if (!obj1 && !obj2)
            output = true; 
    }
    return output; 
}

/** 
 * @description attempts to get a property value from the given json object. If any property in the  
 *  string is null or undefined, returns null. 
 * 
 * @param obj {obj} 
 *  any json object 
 * @param {string} property
 *  string in the form 'property1.property2.property3' 
 * 
 * @returns {*} 
 *  value or null 
 */
/*any*/ function getDeepPropertyValue(obj, property) {
    let output = null;
    if (obj) {
        let props = property.split('.');
        for (var n = 0; n < props.length; n++) {
            let p = props[n];
            if (types.isDefined(obj[p]) && !types.isNull(obj[p])) {
                obj = obj[p];
                if (n === props.length - 1)
                    output = obj;
            }
            else
                break;
        }
    }

    return output;
}

/**  
 * @description takes a deep json object, and returns a recursively flattened version of it. 
 *  For example: 
 * {
 *    '' prop1': 'val1',
 *     'prop2': {
 *         'prop3': 'val2'
 *     }
 * }
 * would be returned as 
 * {
 *     'prop1': 'val1': 
 *     'prop2.prop3': 'val2'
 * }
 * @returns {object} object
 */
/*object*/ function flattenObject(obj) {
    const output = {};
    if (obj) {
        for (let p in obj) {
            let val = obj[p];
            if (!types.isFunction(val) && !types.isObject(val)) {
                output[p] = obj[p];
            }
            else {
                if (types.isObject(val)) {
                    const flat = flattenObject(val);

                    for (var pp in flat) {
                        output[p + '.' + pp] = flat[pp];
                    }
                }
            }
        }    
    }    

    return output;
}

/**  
 * @description creates a deep copy of the given object 
 * 
 * @param {obj} obj
 *  the object to clone 
//
 * @returns {obj} a deep clone of the given object 
 */
/*object*/ function deepCopy(obj) {
    let output = null; 
    if (obj) {
        output = {}; 

        for(let p in obj) {
            if (types.isObject(obj[p])) {
                output[p] = deepCopy(obj[p]); 
            }
            else{
                output[p] = obj[p]; 
            }
        }
    }

    return output; 
}

/**  
 * @description creates a shallow copy of the given object 
 * 
 * @param {obj} obj
 *  the object to clone 
 * @returns {obj} a shallow clone of the given object 
 */
/*object*/ function shallowCopy(obj) {
    let output = null; 
    if (obj) {
        output = {}; 

        for(let p in obj) {
            output[p] = obj[p]; 
        }
    }

    return output; 
}

/**  
 * @description determines whether or not the given object contains a property with the given name
 * 
 * @param {obj} obj 
 *  the object to query 
 * @param {string}
 *  key the property name to find 
 * @returns {bool}
 */
/*bool*/ function containsKey(obj, key) {
    if (obj) {
        for (let k in obj) {
            if (k === key)
                return true;
        }
    }
    return false;
}

/**  
 * @description determines whether or not the given object contains a property with the given value
 * 
 * @param {obj} obj
 *  the object to query 
 * @param {*} value
 *  the property value to find 
 * @returns {bool}
 */
/*bool*/ function containsValue(obj, value) {
    if (obj) {
        for (let k in obj) {
            if (obj[k] === value)
                return true;
        }
    }
    return false;
}

/**  
 * @description non-recursively (top-level only) iterates through the properties of the given object, and 
 *  returns all that satisfy a given criteria 
 * 
 * args
 * @param {obj} obj 
 *  the object whose properties to query 
 * @param {function} query
 *  function in the form (obj) => { return bool }
 * @param {bool} firstOnly
 *  if passed as true, function quits after finding first match
 * 
 * @returns {[*]} array of object that match the given criteria; [] if none
 */
/*object[]*/ function query(obj, queryExpression, firstOnly) {
    let output = []; 
    if (obj) {
        for (let p in obj) {
            if (queryExpression(obj[p])) {
                output.push(obj[p]);
                if (firstOnly) 
                    break; 
            }
        }
    }

    return output; 
}

/**  
 * @description like query(*) but returns only the first item found 
 */
/*object*/ function queryFirst(obj, queryExpression) {
    const output = query(obj, queryExpression, true); 
    return output[0]; 
}

/**  
 */
/*string[]*/ function getKeys(obj) {
    const output = []; 
    if (obj) {
        for (let p in obj) {
            output.push(p); 
        }
    }
    return output; 
}

/**
 * attempts to parse JSON string to object; suppresses any errors 
 * @param {string} s 
 * @returns {json obj}
 */
function tryParse(s) {
    let output = null;
    try {
        output = JSON.parse(s); 
    }
    catch(e) {
        console.error(e);
    }
    return output; 
}


module.exports = {
    getDeepPropertyValue,
    flattenObject,
    deepCopy,
    shallowCopy,
    compareObjects,
    containsKey,
    containsValue,
    query,
    queryFirst,
    getKeys, 
    tryParse
}
