'use strict'; 


function execApiCall (url, method, data, callback) {
    console.log('calling ' + url);

    url = config.apiUrl + url; 
    console.log(url);
    if (data)
        console.log(JSON.stringify(data));

    if (!callback) 
        callback = () => {};

    var options = {
        method: method,
        contentType: 'application/json',
        cache: false,
        //beforeSend: (req) => {
        //    req.setRequestHeader("authtoken", cookies.getAuthToken())
        //},
        success: function (result) {
            console.log(url + ' returned ' + JSON.stringify(result));
            callback(result, null);
        },
        error: function (err) {
            console.log(url + ' api call error');
            console.log(err);
            callback(null, err);
        }
    };

    if (data) {
        options.dataType = 'json';
        options.data = JSON.stringify(data);
        //alert(options.data);
    }

    $.ajax(url, options);
}

function getProviders(callback) {
    execApiCall("/providers", "GET", null, callback); 
}

function getAllEvents(providerId, callback) {
    execApiCall('/events', 'GET', null, callback); 
}

function getEvents(getAll, callback) {
    if (getAll) {
        getAllEvents(callback); 
    }
    else {
        getPendingEvents(callback); 
    }
}

function getAllEvents( callback) {
    execApiCall('/events', 'GET', null, callback); 
}

function getPendingEvents( callback) {
    execApiCall('/events/pending', 'GET', null, callback); 
}

function getEventDetails(eventId, callback) {
    alert(eventId);
    execApiCall('/events/' + eventId, 'GET', null, callback); 
}

function addEvent(providerId, eventId, minBet, callback) {
    execApiCall('/events', 'POST', {
        providerAddress: providerId, 
        providerEventId: eventId, 
        minimumBet: minBet
    }, callback); 
}


$(document).ready(function () {
    window.api = {
        getProviders,
        getEvents,
        getAllEvents,
        getPendingEvents,
        getEventDetails,
        addEvent
    };
}); 