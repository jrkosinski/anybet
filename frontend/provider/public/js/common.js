'use strict'; 

String.prototype.padRight = function(totalLen, paddingChar) {
	var target = this;
    if (!paddingChar)
        paddingChar = ' ';
    while(target.length < totalLen)
        target += paddingChar;
	return target;
};

String.prototype.padLeft = function(totalLen, paddingChar) {
	var target = this;
    if (!paddingChar)
        paddingChar = ' ';
    while(target.length < totalLen)
        target = paddingChar + target;
	return target;
};

const enums = {
    eventState: {
        unknown: 0,
        pending: 1, 
        locked: 2, 
        completed: 3, 
        cancelled: 4
    }
}

function ExceptionHelper() {
    this.try = (callback) => {
        try {
            return callback();
        }
        catch (e) {
            showError(e);
            return null;
        }
    }
}

const exception = new ExceptionHelper();

function showError(err) {
    alert(err);
}

function showForm(id) {
    $(id).css('display', 'initial');
    //$(id).css('margin-top', '0px'); 
    //$(id).show();
}

function hideForm(id) {
    $(id).css('display', 'none');
    //$(id).css('margin-top', '1000px'); 
    //$(id).hide();
}

function getQuerystring() {
    var queries = {};
    $.each(document.location.search.substr(1).split('&'),function(c,q){
        var i = q.split('=');
        queries[i[0].toString()] = i[1].toString();
    });
    return queries;
}

function getFromQuerystring(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function formatTimestamp(timestamp) {
    if (timestamp) {
        const dt = new Date(timestamp * 1000);
        const y = dt.getFullYear().toString();
        const m = (dt.getMonth()+1).toString().padLeft(2, '0'); 
        const d = (dt.getDate()).toString().padLeft(2, '0'); 
        const h = (dt.getHours()).toString().padLeft(2, '0'); 
        const min = (dt.getMinutes()).toString().padLeft(2, '0'); 

        return `${m}-${d}-${y} ${h}:${min}`; 
    }
    return ""; 
}

function getDateFromTimestamp(timestamp) {
    const dt = new Date(timestamp * 1000); 
    const y = dt.getFullYear().toString(); 
    const m = padZero((dt.getMonth() + 1).toString()); 
    const d = padZero(dt.getDate().toString()); 

    return y + '-' + m + '-' + d; 
}

function getTimeFromTimestamp(timestamp) {
    const dt = new Date(timestamp * 1000); 
    const h = padZero(dt.getHours().toString());
    const m = padZero(dt.getMinutes().toString()); 
    const s = padZero(dt.getSeconds().toString()); 

    return h + ':' + m + ':' + s; 
}

function getStateName(state) {
    state = parseInt(state); 
    for (let e in enums.eventState) {
        if (enums.eventState[e] === state) {
            return e; 
        }
    }
    return state.toString();
}


$(document).ready(function () {
    window.common = {
        showError, 
        getQuerystring,
        getFromQuerystring, 
        formatTimestamp, 
        getDateFromTimestamp,
        getTimeFromTimestamp, 
        getStateName,

        enums,
        exception
    };
}); 