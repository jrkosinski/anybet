'use strict'; 

const types = require('./types'); 
const json = require('./json'); 

/** =====================================================================================================
 * @name arrays 
 * @description Generic array handling functionality 
 * 
 * @author John R. Kosinski
 * 22 Feb 2018
 */
const configUtil = require('./configUtil'); 

/** 
 * @description removes item at the specified index 
 *  NOTE: removes the original array
 * @param {*} array 
 * @param {*} n 
 * @returns {[*]} pointer to array
 */
/*any[]*/ function removeAt(array, n) {
    if (array && Array.isArray(array)) {
        if (array.length > n)
            return array.splice(n, 1); 
    }
    return array;
}; 

/** 
 * @description clears all items from array 
 *  NOTE: modifies original array 
 * @returns {[*]} pointer to array
*/
/*any[]*/ function clear (array) {
    if (array && Array.isArray(array)) {
        this.splice(0, array.length); 
    }
    return array;
};

/** 
 * @description gets the first item in the array, or null. 
 * @param {*} condition
 * (optional) if passed, only considers the subset of the array that matches the condition 
 *      (i.e, gets the first element that matches the condition)
 * @returns {*} array item
*/
/*any*/ function firstOrDefault(array, condition) {
    if (!condition) {
        return array && array[0] ? array[0] : null;
    }
    else {
        let output = where(array, condition); 
        if (output && output.length) {
            return output[0]; 
        }
    }

    return null;
};

/** 
 * @description gets the last item in the array, or null. 
 * @param {function} condition
 * (optional) if passed, only considers the subset of the array that matches the condition 
 *  (i.e, gets the last element that matches the condition)
 * @returns {*} array item
*/
/*any*/ function lastOrDefault(array, condition) {
    if (!condition) {
        return array && array[array.length-1] ? array[array.length-1] : null;
    }
    else {
        let output = where(array, condition); 
        if (output && output.length) {
            return output[output.length-1]; 
        }
    }

    return null;
};

/** 
 * @description gets all elements of the array that match the given query. 
 * @param {function} query: a function in the form (item) => { return boolean }; returns true 
 *  if the item is a match and should be returned
 * @returns {[*]} pointer to array
*/
/*any[]*/ function where(array, query) {
    let output = [];
    if (array && Array.isArray(array)) {
        for (var n=0; n<array.length; n++){
            if (query(array[n]))
                output.push(array[n]); 
        }
    }
    return output; 
};

/** 
 * @description gets all elements of the array that match the given query. 
 * @param {*} query
 *  a function in the form (item) => { return boolean }; returns true 
 *  if the item is a match and should be returned
 * @returns {[*]} pointer to array
*/
/*int*/ function count(array, query) {
    let output = 0;
    if (array && Array.isArray(array)) {
        let sub = where(array, query); 
        if (sub) 
            output = sub.length;
    }
    return output; 
};

/** 
 * @description determines whether the at least one element matching the query exists in the array. 
 * @param {*} query
 *  a function in the form (item) => { return boolean }; returns true 
 *  if the item is a match and should be returned
 * @returns {bool} 
*/
/*bool*/ function exists (array, query) {
    if (array && Array.isArray(array)) {
        let w = where(array, query); 
        return (w && w.length);
    }
    
    return false;
};

/** 
 * @description gets the index of the first element matching the query exists in the array. 
 * @param {*} query
 *  a function in the form (item) => { return boolean }; returns true if the item is a match
 * @returns {int} 
*/
/*int*/ function indexOf(array, query) {
    if (array && Array.isArray(array)) {
        for (let n=0; n<array.length; n++) {
            if (query(array[n]))
                return n;
        }
    }
    
    return -1;
}

/** 
 * @description determines whether the at least one element equal to the given item exists in the array.
 * @param {*} obj
 *  an object value, will be compared with ===. If you need any other kind of comparison, 
 *  use exists(array, query) instead. 
 * @returns {bool} 
*/
/*bool*/ function contains (array, obj) {
    return exists(array, (i) => { return i === obj; }); 
};

/** 
 * @description selects a given property from each element of the array, and returns those properties in 
 *  a new array. 
 * @param {*} propName
 *  the property name 
 * @returns {[*]} pointer to array
*/
/*any[]*/ function select(array, propName) {
    let output = [];
    if (array && Array.isArray(array)) {
        for (var n=0; n<array.length; n++){
            let value = json.getDeepPropertyValue(array[n], propName); 
            output.push(value); 
        }
    }

    return output; 
}

/** 
 * @description removes each element that satisfies the given query. Returns the resulting array.
 *  NOTE: modifies the array passed in.
 * @param {function} condition
 *  a function in the form (item) => { return boolean }; returns true 
 *  if the item is a match and should be returned
 * @returns {[*]} pointer to array
*/
/*any[]*/ function removeWhere(array, condition) {
    if (array && Array.isArray(array)) {
        for (var n=array.length-1; n>=0; n--){
            if (condition(array[n])){
                removeAt(array, n); 
            }
        }
    }
    return array; 
};

/** 
 * @description removes only the first element that satisfies the given query. Returns the resulting array.
 *  NOTE: modifies the array passed in.
 * @param {function} condition
 *  (optional) a function in the form (item) => { return boolean }; returns true 
 *  if the item is a match and should be returned
 * @returns {[*]} pointer to array
*/
/*any[]*/ function removeFirstWhere(array, condition) {
    return removeFirst(array, condition);
};

/** 
 * @description removes only the first element that satisfies the given query. Returns the resulting array.
 *  NOTE: modifies the array passed in.
 * @param {*} condition
 *  (optional) a function in the form (item) => { return boolean }; returns true 
 *  if the item is a match and should be returned
 * @returns {[*]} pointer to array
*/
/*any[]*/ function removeFirst(array, condition) {
    if (array && Array.isArray(array)) {
        if (condition) {
            for (var n=0; n<array.length; n++){
                if (condition(array[n])){
                    removeAt(array, n); 
                    break;
                }
            }
        }
        else {
            if (array.length) 
                array.splice(0, 1); 
        }
    }
    return array; 
};

/** 
 * @description removes only the first element that satisfies the given query. Returns the resulting array.
 *  NOTE: modifies the array passed in.
 * @param {function} condition
 *  (optional) a function in the form (item) => { return boolean }; returns true 
 *  if the item is a match and should be returned. 
 * @returns {[*]} pointer to array
*/
/*any[]*/ function removeLast(array, condition) {
    if (array && Array.isArray(array)) {
        if (condition) {
            for (var n=array.length-1; n>=0; n--){
                if (condition(array[n])){
                    removeAt(array, n); 
                    break;
                }
            }
        }
        else {
            if (array.length) 
                array.splice(array.length-1, 1); 
        }
    }
    return array; 
};

/** 
 * @description removes all elements that are null or undefined. 
 *  NOTE: modifies original array
 * @returns {[*]} pointer to array
*/
/*any[]*/ function removeWhereNullOrUndefined(array) {
    if (array && Array.isArray(array)) {
        return removeWhere(array, (i) => {
            return types.isUndefinedOrNull(i); 
        }); 
    }
    return null;
};

/** 
 * @description merges both given arrays into one new array with no duplicates, and returns that new array. 
 * @param {function} equalityComparison
 *  function in the form (element1, element2) => { return bool }
 *  to check for equality of elements (ensure uniqueness in resulting array)
 * @returns {[*]} new array 
*/
/*any[]*/ function merge(array1, array2, equalityComparison) {
    let output = [];

    if (!equalityComparison)
        equalityComparison = (a, b) => { return a === b}; 

    const addFromArray = (array) => {
        for (var n=0; n<array.length; n++) {
            if (!exists(output, (e) => { return equalityComparison(e, array[n]);}))
                output.push(array[n]); 
        }
    }
    
    if (array1)
        addFromArray(array1); 

    if (array2)
        addFromArray(array2); 

    return output; 
}

/** 
 * @description performs the given operation on each element of the given array
 *  NOTE: modifies original array
 * @param {[*]} array: the array on which to perform operation
 * @param {function} func: the operation to perform (function in the form (element, index))
 * @returns {[*]} pointer to original array
*/
/*any[]*/ function operate(array, func) {
    if (array && Array.isArray(array)) {
        for (var n=0; n<array.length; n++) {
            func(array[n], n);
        }
    }
    return array;
}

/** 
 * @description returns a clone of the given array 
 * @param {int} startIndex
 *  optional; defaults to 0
 * @param {int} length
 *  optional; defaults to array.length
 * @returns {[*]} pointer to clone of array
*/
/*any[]*/ function clone(array, startIndex, length) {    
    let clone = null; 

    if (array && Array.isArray(array)) {
        clone = []; 
        
        if (types.isUndefinedOrNull(startIndex))
            startIndex = 0; 
        if (types.isUndefinedOrNull(length))
            length = array.length - startIndex; 

        if (startIndex < 0)
            startIndex = 0; 

        if (startIndex >= array.length)
            startIndex = (array.length -1); 

        if (length + startIndex > array.length)
            length = array.length - startIndex;

        for(var n=startIndex; n<length; n++) {
            clone.push(array[n]); 
        }
    }

    return clone;
}

/** 
 * @description returns true if the given object is null, not an array, or is an empty array. 
 * @param {[*]} array
 *  alleged array 
 * @returns {bool}
*/
/*bool*/ function nullOrEmpty(array) {
    return !(array && array.length && Array.isArray(array));
}

/** 
 * @description converts an array to a comma-delimited english-sentence string 
 * e.g. 'eggs, bacon, coffee, and orange juice'
 * @returns {string} 
*/
/*string*/ function toText(array) {
    let output = ''; 
    
    if (array && Array.isArray(array)) {
        if (array.length === 1)
            output = array[0].toString(); 
        if (array.length === 2)
            output = array[0].toString() + ' and ' + array[1].toString();
        else{
            for (var n=0; n<array.length; n++) {
                if (n > 0)
                    output += ', ';
                if (n === array.length-1)
                    output += 'and '; 
                output += array[n].toString(); 
            }
        }
    }

    return output; 
}

/** 
 * @description gets a subset of the given array, returned as a new array
 * @param {[*]} array
 *  array of which to get a subset
 * @param {int} start
 *  start index to start copying 
 * @param {int} count
 *  number of elements to copy from start index
 * @returns {[*]} array (copy) 
*/
/*any[]*/ function subset(array, start, count) {
    let output = []; 
    if (array && Array.isArray(array)) {
        if (start < 0)
            start =0; 
        if (count < 0)
            count = 0; 
        for (var n=0; n<count; n++){
            let index = (start+n); 
            if (index >= array.length) 
                break; 
            output.push(array[index]); 
        }
    }
    return output; 
}

/** 
 * @description returns a shallow copy of the given array 
 * @param {[*]} array
 *  the array to shallow-copy
 * @returns {[*]} array (copy) 
*/
/*any[]*/ function copy(array) {

    //if null, return null;
    if (!array)
        return null; 

    //if not an array, return what was passed in
    if (!Array.isArray(array))
        return array; 
    
    //shallow copy elements
    let output = []; 
    for (let n=0; n<array.length; n++) {
        output.push(array[n]); 
    }

    return output; 
}

/** 
 * @description returns a deep copy of the given array 
 * @param {[*]} array: the array to deep-copy
 * @returns {[*]} array (copy) 
*/
/*any[]*/ function deepCopy(array) {

    //if null, return null;
    if (!array)
        return null; 

    //if not an array, return what was passed in
    if (!Array.isArray(array))
        return array; 
    
    //shallow copy elements
    let output = []; 
    for (let n=0; n<array.length; n++) {
        output.push(json.deepCopy(array[n])); 
    }

    return output; 
}

/** 
 * @description returns a boolean value indicating whether or not the two arrays have all of the same elements; 
 *  equality comparison is done naively using === 
 * @returns {[*]} array (copy) 
*/
/*bool*/ function areEqual(array1, array2) {

    //if both null, return true 
    if (!array1 && !array2)
        return true;

    //if only one null, return false 
    if (!array1 || !array2)
        return false;

    //compare elements count 
    if (array1.length !== array2.length)
        return false;

    //compare elements 
    for (let n=0; n<array1.length; n++) {
        if (array1[n] !== array2[n])
            return false;
    }

    return true;
}


module.exports = {
    nullOrEmpty,
    select,
    where, 
    count,
    exists,
    indexOf,
    contains,
    removeWhere, 
    removeFirstWhere, 
    removeWhereNullOrUndefined,
    removeLast,
    firstOrDefault,
    lastOrDefault,
    clear,
    removeAt,
    toText,
    merge,
    operate,
    clone,
    subset,
    copy,
    deepCopy,
    areEqual
};