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
    callback([  {
            id: '0xDCCF5053f0a62F2C6E59bE7C16579D566E5F41F1'
        }
    ]); 
}

function getAllEvents(providerId, callback) {
    execApiCall('/events', 'GET', null, callback); 
}

function getPendingEvents(providerId, callback) {
    execApiCall('/events/pending', 'GET', null, callback); 
}

function getEventDetails(providerId, eventId, callback) {
    execApiCall('/events/' + eventId, 'GET', null, callback); 
}

function createEvent(providerId, name, options, date, callback) {
    execApiCall('/events', 'POST', {
        name: name, 
        options: options, 
        date: date
    }, callback); 
}

function cancelEvent(providerId, eventId, callback) {
    execApiCall(`/events/${eventId}`, 'PUT', { action: 'cancel'}, callback); 
}

function lockEvent(providerId, eventId, callback) {
    execApiCall(`/events/${eventId}`, 'PUT', { action: 'lock'}, callback); 
}

function completeEvent(providerId, eventId, outcome, callback) {
    execApiCall(`/events/${eventId}`, 'PUT', { action: 'complete', outcome:outcome}, callback); 
}



$(document).ready(function () {
    window.api = {
        getProviders,
        getAllEvents,
        getPendingEvents,
        getEventDetails,
        createEvent,
        cancelEvent,
        lockEvent,
        completeEvent
    };
}); 