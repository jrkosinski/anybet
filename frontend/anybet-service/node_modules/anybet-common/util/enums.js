'use strict'; 

/** ===============================================================================================
 * @name enums 
 * @description Enums that are used app-wide.
 * 
 * @author John R. Kosinski
 * 28 Feb 2018
*/
const config = require ('./configUtil'); 

module.exports = {
    eventState: {
        unknown: 0,
        pending: 1, 
        locked: 2, 
        completed: 3, 
        cancelled: 4
    }
};


