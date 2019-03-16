'use strict'; 

function getProviders(callback) {
    callback([  {
            id: '7838jkslsdkjls'
        }, {
            id: "sjdksldjkl23289"
        }
    ]); 
}

function getAllEvents(providerId, callback) {
    getPendingEvents(providerId, callback); 
}

function getPendingEvents(providerId, callback) {
    callback([
        {
            id: "kramubusdnsaaga",
            name: "man v. wild", 
            options: [
                "man", 
                "wild"
            ], 
            date: new Date()
        },
        {
            id: "bogdmanaiwveich",
            name: "tam v. lin", 
            options: [
                "tam", 
                "lin"
            ], 
            date: new Date()
        },
        {
            id: "suksanwankert",
            name: "bouldner v. kraft",  
            options: [
                "bouldner", 
                "kraft"
            ], 
            date: new Date()
        }
    ]);
}

function getEventDetails(providerId, eventId, callback) {
    callback({
        id: "gudenteskty",
        name: "rodgers v. hammerstein", 
        date: 1552852857, 
        options: [
            "rodgers", 
            "hammerstein"
        ]
    }); 
}

function createEvent(providerId, name, options, date, callback) {
    callback("new_id");
}

function cancelEvent(providerId, eventId, callback) {
    callback(true);
}

function lockEvent(providerId, eventId, callback) {
    callback(true);
}

function completeEvent(providerId, eventId, callback) {
    callback(true);
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