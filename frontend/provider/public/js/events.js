'use strict'; 

let _providerId = null; 
let _currentEventId = null; 

function showEventDetail(evt) {
    _currentEventId = evt.id; 

    $("#event-detail-id-div").text(evt.id); 
    $("#event-detail-name-div").text(evt.name); 
    $("#event-detail-date-div").text(formatTimestamp(evt.date)); 
    $("#event-detail-options-div").empty(); 

    if (evt.options && evt.options.length) {
        for (let n=0; n<evt.options.length; n++) {
            $("#event-detail-options-div").append("<div>" + evt.options[n] + "</div>");
        }
    }
    showForm("#event-detail-overlay"); 
}

function clearCreateForm() {
    $("#event-create-name-text").val(""); 
    $("#event-create-date-text").val(""); 
    $("#event-create-options-text").val(""); 
}

function onEventClick(providerId, eventId) {
    api.getEventDetails(providerId, eventId, (data, err) => {
        if (err) {
            common.showError(err); 
        }
        else {
            if (data) {
                showEventDetail(data); 
            }
        }
    }); 
}

function refreshEvents(providerId) {
    api.getAllEvents(providerId, (data, err) => {
        if (err) {
            common.showError(err); 
        }
        else {
            $("#events-list-div").empty(); 
            if (data && data.length) {
                for (let n=0; n<data.length; n++) {
                    $("#events-list-div").append(getEventDivHtml(providerId, data[n])); 
                }
            }
        }
    });
}

function getEventDivHtml(providerId, evt) {
    return `<div><a href="#" onclick="onEventClick('${providerId}', '${evt.id}')" id="event-row-${evt.id}">${evt.id}</span></a>`
}

function onCancelButtonClick(providerId, eventId) {
    api.cancelEvent(providerId, eventId, (data, err) => {
        if (err) {
            showError(err); 
        }
        else {
            refreshEvents(providerId); 
        }
    });
}

function onLockButtonClick(providerId, eventId) {
    api.lockEvent(providerId, eventId, (data, err) => {
        if (err) {
            showError(err); 
        }
        else {
            refreshEvents(providerId); 
        }
    });
}

function onCompleteButtonClick(providerId, eventId) {
    api.completeEvent(providerId, eventId, (data, err) => {
        if (err) {
            showError(err); 
        }
        else {
            refreshEvents(providerId); 
        }
    });
}


$(document).ready(() => {
    hideForm("#event-detail-overlay"); 
    hideForm("#event-create-overlay"); 

    _providerId = common.getFromQuerystring("provider"); 
    refreshEvents(_providerId);

    $("#event-create-button").click(() => {
        showForm("#event-create-overlay"); 
    });

    $("#event-create-create-button").click(() => {
        clearCreateForm();
        hideForm("#event-create-overlay"); 
    });

    $("#event-create-cancel-button").click(() => {
        clearCreateForm();
        hideForm("#event-create-overlay"); 
    });

    $("#event-cancel-button").click(() => {
        onCancelButtonClick(_providerId, _currentEventId); 
    });

    $("#event-lock-button").click(() => {
        onLockButtonClick(_providerId, _currentEventId); 
    });

    $("#event-complete-button").click(() => {
        onCompleteButtonClick(_providerId, _currentEventId); 
    });
});
