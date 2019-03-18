'use strict'; 

/** ===============================================================================================
 * @name strings 
 * @description String processing/handling.
 * 
 * @author John R. Kosinski
 * @date 13 Jan 2018
/*string*/ String.prototype.replaceAll = function (search, replacement) {
	let target = this;
	return target.split(search).join(replacement);
};

/** 
 * @description determines whether or not the given string contains the given string 
 * @returns {bool}
 */
/*bool*/ String.prototype.contains = function (search) {
	let target = this;
	return target.indexOf(search) >= 0;
};

/** 
 * @description pads the right side of the given string until it reaches the desired length
 * @param {int} totalLen
 * 	the total desired length of the output string 
 * @param {char} paddingChar
 * 	the character to add to the left of the string until it reaches desired length
 * @returns {string} 
 */
/*string*/ String.prototype.padRight = function(totalLen, paddingChar) {
	let target = this;
    if (!paddingChar)
        paddingChar = ' ';
    while(target.length < totalLen)
        target += paddingChar;
	return target;
};

/** 
 * @description pads the left side of the given string until it reaches the desired length
 * @param {int} totalLen
 * 	the total desired length of the output string 
 * @param {char} paddingChar
 * 	the character to add to the left of the string until it reaches desired length
 * @returns {string} 
 */
/*string*/ String.prototype.padLeft = function(totalLen, paddingChar) {
	let target = this;
    if (!paddingChar)
        paddingChar = ' ';
    while(target.length < totalLen)
        target = paddingChar + target;
	return target;
};

/** 
 * @description returns true if the string ends with a common punctuation symbol 
 * (ignoring any trailing whitespace)
 * @returns {bool} 
 */
/*bool*/ String.prototype.endsWithPunctuation = function () {
	let target = this;
	target = target.trim();
	if (target.length) {
		let c = target[target.length - 1];
		if (!c.match(/^[0-9a-zA-Z]+$/))
			return true;
	}
	return false;
};

/** 
 * @description capitalizes the first character, converts all others to lowercase 
 * (e.g. JOHN becomes John, john becomes John)
 * @returns {string} 
 */
/*string*/ String.prototype.toProperCase = function() {
	let target = this; 
	if (target.length > 0) {
		let first = target.substring(0, 1).toUpperCase(); 
		let rest = ''; 
		if (target.length > 1) {
			rest = target.substring(1, target.length).toLowerCase(); 
		}
		return first + rest; 
	}
	return target;
}; 

/** 
 * @description determines whether or not the given value represents a number in some way 
 * @param {*} value 
 * @returns {bool} 
 */
/*bool*/ function isNumeric(value){
	if (value === undefined || value === null) 
		return false;
	
	let s = value.toString(); 
	let pattern = /^\d+$/;
    return pattern.test(s);
}

/** 
 * @description truncates the given string to a given max length
 * @returns {string} 
 */
/*string*/ function truncate(s, length) {
	if (s && s.length) {
		if (s.length > length) {
			s = s.substring(0, length) + '...'; 
		}
	}
	return s; 
}

module.exports = {
	isNumeric, 
	truncate
};