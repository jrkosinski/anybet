'use strict';

const exception = require("./exceptions")('NUM');

/** 
 * @description gets the number of decimal places represented in the given value
 * @param {float} value
 *  any number 
 * @returns {float} 
 */
/*int*/ function getNumDecimalPlaces(value) {
    return exception.try(() => {
        let output = 0;
        let s = convertFromScientific(value.toString());

        if (s.indexOf('.') >= 0) {
            let ss = s.split('.');
            if (ss.length > 1) {
                s = ss[1];
                output = s.length;
            }
        }

        return output;
    });
}

/** 
 * @description if the given number is in scientific notation, converts it to a normal 
 * (non-scientific) string representation of the number. 
 * @param {float} num
 *  a decimal number 
 * @returns {string}
 */
/*string*/ function convertFromScientific(num) {
    return exception.try(() => {
        //if the number is in scientific notation remove it
        if (/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
            let zero = '0',
                parts = String(num).toLowerCase().split('e'), //split into coeff and exponent
                e = parts.pop(),//store the exponential part
                l = Math.abs(e), //get the number of zeros
                sign = e / l,
                coeff_array = parts[0].split('.');
            if (sign === -1) {
                num = zero + '.' + new Array(l).join(zero) + coeff_array.join('');
            }
            else {
                let dec = coeff_array[1];
                if (dec) l = l - dec.length;
                num = coeff_array.join('') + new Array(l + 1).join(zero);
            }
        }

        return num.toString();
    });
}

/** 
 * @description returns the highest value in the given array of numbers 
 * @param {float[]} array
 *  an array of numbers  
 * @returns {float[]}
 */
/*[]]*/ function max(array) {
    return exception.try(() => {
        let max = null;
        for(let n=0; n<array.length; n++) {
            if (max === null) 
                max = array[n]; 
            if (array[n] > max)
                max = array[n]; 
        }
        return max; 
    });
}

/** 
 * @description returns the percent by which a is different from b. if a is 100 and b is 50, returns 100(%)
 * @param {float} a
 * @param {float} b
 * @returns {float} a percentage expressed as a whole number (e.g. 50% is expressed as 50, not 0.5)
 *      output is an absolute value  
 * @returns {float}
 */
/*float*/ function percentDifference(a, b) {
    return Math.abs(a - b)/b * 100; 
}

/** 
 * @description rounds the given number to a specific number of decimal places 
 * @param {float} n
 *  the number to round
 * @param {int} numPlaces
 *  the number of decimal places to round to 
 * @returns {float}
 */
/*float*/ function roundToNumDecimals(n, numPlaces) {
    if (numPlaces <= 0)
        return Math.round(n); 
    
    const multiplier = Math.pow(10, numPlaces); 
    return Math.round(n * multiplier) / multiplier; 
}

/**
 * @description converts the given decimal number to hex string (including the leading 0x, optionally)
 * @param {int} d
 * @param {bool} include0x - false by default; if true adds 0x in front of output
 * @returns {string} the hex representation, e.g. 0xffda10
 */
/*int*/ function decimalToHex(d, include0x) {
    let hex = d.toString(16); 
    if (hex.length %2) {
        hex = '0' + hex;
    }

    if (include0x)
        hex = '0x' + hex;

    return hex;
}

/**
 * @description converts the given hex number string (e.g. 0xff0012) to a decimal integer
 * @param {string} hex
 * @returns {int} the decimal number representation
 */
/*string*/ function hexToDecimal(hex) {
    let output = 0; 
    if (hex && hex.length) {
        if (hex.startsWith('0x')) {
            hex = hex.substring(2); 
        }
        try {
            output = parseInt(hex, 16);
        }
        catch(e) {
            console.error(e);
            output = 0; 
        }
    }

    return output; 
}

module.exports = {
    getNumDecimalPlaces,
    convertFromScientific,
    percentDifference, 
    roundToNumDecimals,
    hexToDecimal,
    decimalToHex,
    max
};