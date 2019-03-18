'use strict'; 

/** ===============================================================================================
 * @name dates 
 * @description Utilities for handling dates and timestamps.
 * 
 * @author John R. Kosinski
 * @date 13 Jan 2018
 */
Date.prototype.toTimestamp = () => {
    return Math.floor(this.getTime());
}

/**  
 * @description converts timestamp to string 
 * @param {int} timestamp
 *  a timestamp 
 * @returns {string} 
 */
/*string*/ function toDateString(timestamp) {
    return fromTimestamp(timestamp).toString();
}

/**  
 * @description converts a timestamp to a js Date object
 * @param {int} timestamp
 *  a timestamp 
 * @returns {Date}
 */
/*Date*/ function fromTimestamp(timestamp) {
    return new Date(timestamp);
}

/**  
 * @description converts a Date object to timestamp
 * @param {Date} d
 *  a Date object
 * @returns {int}
 */
/*int*/ function toTimestamp(d) {
    if (!d.getTime)
        d = new Date(d);
    return Math.floor(d.getTime());
}

/**  
 * @description gets the timestamp for current date & time
 * @returns {int}
 */
/*int*/ function getTimestamp() {
    return toTimestamp(new Date());
}

/**  
 * @description adds the given number of years to the given timestamp, and returns 
 * it as timestamp
 * @param {int} years
 *  the number of years to add
 * @param {int} timestamp
 *  timestamp
 * @returns {int}
 */
/*int*/ function addYearsTimestamp(years, timestamp) {
    return addHoursTimestamp(365 * years, timestamp);
}

/**  
 * @description adds the given number of days to the given timestamp, and returns it as a timestamp
 * @param {int} days
 *  the number of days to add
 * @param {int} timestamp
 *  timestamp
 * @returns {int}
 */
/*int*/ function addDaysTimestamp(days, timestamp) {
    return addHoursTimestamp(60 * days, timestamp);
}

/**  
 * @description adds the given number of hours to the given timestamp, and returns it as timestamp
 * @param {int} hours
 *  the number of hours to add
 * @param {int} timestamp
 *  a timestamp
 * @returns {int}
 */
/*int*/ function addHoursTimestamp(hours, timestamp) {
    return addMinutesTimestamp(60 * hours, timestamp);
}

/**  
 * @description adds the given number of minutes to the given timestamp, and returns it as a timestamp
 * @param {int} minutes
 *  the number of minutes to add
 * @param {int} timestamp
 *  a timestamp
 * @returns {int}
 */
/*int*/ function addMinutesTimestamp(minutes, timestamp) {
    if (!timestamp)
        timestamp = getTimestamp();

    timestamp += (minutes * 60 * 1000);
    return timestamp;
}

/**  
 * @description adds the given number of years to the given Date, and returns it as a Date
 * @param {int} years
 *  the number of years to add
 * @param {Date} date
 *  javascript Date object
 * @returns {Date}
 */
/*Date*/ function addYearsDate(years, date) {
    if (!date)
        date = new Date();

    return fromTimestamp(addYearsTimestamp(years, toTimestamp(date)));
}

/**  
 * @description adds the given number of days to the given Date, and returns it as a Date
 * @param {int} days
 *  the number of days to add
 * @param {Date} date
 *  javascript Date object
 * @returns {Date}
 */
/*Date*/ function addDaysDate(days, date) {
    if (!date)
        date = new Date();

    return fromTimestamp(addDaysTimestamp(days, toTimestamp(date)));
}

/**  
 * @description adds the given number of hours to the given Date, and returns it as a Date
 * @param {int} hours
 *  the number of hours to add
 * @param {Date} date
 *  javascript Date object
 * @returns {Date}
 */
/*Date*/ function addHoursDate(hours, date) {
    if (!date)
        date = new Date();

    return fromTimestamp(addHoursTimestamp(hours, toTimestamp(date)));
}

/**  
 * @description adds the given number of minutes to the given Date, and returns it as a Date
 * @param {int} minutes
 *  the number of minutes to add
 * @param {Date} date
 *  javascript Date object
 * @returns {Date}
 */
/*Date*/ function addMinutesDate(minutes, date) {
    if (!date)
        date = new Date();

    return fromTimestamp(addMinutesTimestamp(minutes, toTimestamp(date)));
}

/**  
 * @description returns the number of seconds difference between the first and second given dates 
 *  (NOTE: it's (date2 - date1))
 * @param {Date} date1 
 * @param {Date} date1 
 * @returns {int}
 */
/*int*/ function dateDiffSeconds(date1, date2) {
    return timestampDiffSeconds(toTimestamp(date1), date2 ? toTimestamp(date2) : null);
}

/**  
 * @description returns the number of seconds difference between the first and second given timestamps 
 *  (NOTE: it's (timestamp2 - timestamp1))
 * @param {int} timestamp1 
 * @param {int} timestamp2 
 * @returns {int}
 */
/*int*/ function timestampDiffSeconds(timestamp1, timestamp2) {
    if (!timestamp2)
        timestamp2 = getTimestamp();
    return ((timestamp2/1000) - (timestamp1/1000));
}

/**  
 * @description returns the number of minutes difference between the first and second given timestamps 
 *  (NOTE: it's (timestamp2 - timestamp1))
 * @param {int} timestamp1 
 * @param {int} timestamp2 
 * @returns {int}
 */
/*int*/ function timestampDiffMinutes(timestamp1, timestamp2) {
    return Math.ceil(timestampDiffSeconds(timestamp1, timestamp2)/60); 
}

/**  
 * @description gets the number of seconds that have passed since given date timestamp
 * @param {int} timestamp 
 * @returns {int}
 */
/*int*/ function secondsSinceTimestamp(timestamp) {
    let output = 0;
    const now = getTimestamp();

    if (timestamp) {
        output = ((now/1000) - (timestamp/1000));

        if (output < 0)
            output = 0;
    }

    return output;
}

/**  
 * @description gets the number of minutes that have passed since given date timestamp
 * @param {int} timestamp 
 * @returns {int}
 */
/*int*/ function minutesSinceTimestamp(timestamp) {
    return Math.floor(secondsSinceTimestamp(timestamp)/60); 
}

/**  
 * @description gets the number of seconds that have passed since given date 
 * @param {Date} date
 * @returns {int}
 */
/*int*/ function secondsSinceDate(date) {
    return secondsSinceTimestamp(toTimestamp(date)); 
}

/**  
 * @description gets the number of minutes that have passed since given date 
 * @param {Date} date
 * @returns {int}
 */
/*int*/ function minutesSinceDate(date) {
    return minutesSinceTimestamp(toTimestamp(date)); 
}

/**  
 * @description returns the number of milliseconds in the given number of seconds
 * @param {int} count
 * @returns {int}
 */
/*int*/ function seconds(count) {
    return (count * 1000); 
}

/**  
 * @description returns the number of milliseconds in the given number of minutes
 * @param {int} count
 * @returns {int}
 */
/*int*/ function minutes(count) {
    return (count * 1000 * 60); 
}

/**  
 * @description returns the number of milliseconds in the given number of hours
 * @param {int} count
 * @returns {int}
 */
/*int*/ function hours(count) {
    return (count * 1000 * 60 * 60); 
}


module.exports = {
    toDateString,
    fromTimestamp,
    toTimestamp,
    getTimestamp,
    addYearsTimestamp,
    addDaysTimestamp,
    addHoursTimestamp,
    addMinutesTimestamp,
    addYearsDate,
    addDaysDate,
    addHoursDate,
    addMinutesDate, 
    dateDiffSeconds,
    timestampDiffSeconds,
    timestampDiffMinutes,
    secondsSinceTimestamp,
    minutesSinceTimestamp,
    secondsSinceDate,
    minutesSinceDate,
    seconds, 
    minutes,
    hours
};