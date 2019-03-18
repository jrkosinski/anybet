'use strict'; 

let _series = [1,2,3];

/** ===============================================================================================
 * @name fibonacci 
 * @description Getting fib series values. 
 * 
 * @author John R. Kosinski
 * 13 Jan 2018
 */
function getSeries(upTo) {
    let limit = _series[_series.length-1]; 
    if (limit >= upTo)
        return _series; 

    while(limit < upTo){
        limit += _series[_series.length-2]; 
        if (limit > upTo)
            return _series; 
        else
            _series.push(limit); 
    }
}

/** ------------------------------------------------------------------------------------------------------
 * @description gets next number in the series (number after given one)
 * 
 * @param {float} n
 *  the current number in series 
 *
/* @returns {float}  
/*int*/ function next(n){
    let limit = _series[_series.length-1]; 
    if (n > limit) {
        getSeries(n);
        let next = _series[_series.length-1] + _series[_series.length-2]; 
        _series.push(next); 
        return next; 
    }
    else{
        for(var i=0; i<_series.length; i++){
            if (_series[i] == n){
                if (i < _series.length-1)
                    return _series[i+1]; 
                else{
                    let next = _series[_series.length-1] + _series[_series.length-2]; 
                    _series.push(next); 
                    return next; 
                }
            }
        }
    }
    return 0; 
}

/** ------------------------------------------------------------------------------------------------------
 * @description gets previous number in the series (number preceding given one)
 * 
 * @param {float} n
 *  the current number in series 
 *  
 * @returns {float}
/*int*/ function prev(n){
    let limit = _series[_series.length-1]; 
    if (n > limit) {
        getSeries(n);
        let prev = _series[_series.length-2] ;
        return prev; 
    }
    else{
        for(var i=0; i<_series.length; i++){
            if (_series[i] == n){
                return _series[i-1]; 
            }
        }
    }
    return 0; 
}

module.exports = {
    getSeries : getSeries, 
    next : next,
    prev : prev
};