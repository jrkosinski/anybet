'use strict'; 

let _providerId = null; 
let _currentEventId = null; 
let _showAll = false;

function showEventDetail(evt) {
    _currentEventId = evt.id; 

    $("#event-detail-id-div").text(evt.id); 
    $("#event-detail-name-div").text(evt.name); 
    $("#event-detail-date-div").text(formatTimestamp(evt.date)); 
    $("#event-detail-options-div").empty(); 
    $("#complete-options-list").empty(); 
    $("#event-detail-state-div").text(common.getStateName(evt.state)); 
    $("#event-detail-outcome-div").text(evt.outcome); 

    if (evt.options && evt.options.length) {
        for (let n=0; n<evt.options.length; n++) {
            $("#event-detail-options-div").append("<div>" + evt.options[n] + "</div>");
            $("#complete-options-list").append(`<option value="${n}">${evt.options[n]}</option>`);
        }
    }
    showForm("#event-detail-overlay"); 
}

function clearCreateForm() {
    $("#event-create-name-text").val(""); 
    $("#event-create-date-text").val(Math.floor(new Date().getTime()/1000)); 
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
    const retrieveFunc = (_showAll) ? api.getAllEvents : api.getPendingEvents; 
    retrieveFunc(providerId, (data, err) => {
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
    api.cancelEvent(providerId, eventId, (err, data) => {
        if (err) {
            showError(err); 
        }
        else {
            hideForm("#event-detail-overlay");
            refreshEvents(providerId); 
        }
        hideForm("#event-detail-overlay"); 
    });
}

function onLockButtonClick(providerId, eventId) {
    api.lockEvent(providerId, eventId, (err, data) => {
        if (err) {
            showError(err); 
        }
        else {
            hideForm("#event-detail-overlay");
            refreshEvents(providerId); 
        }
        hideForm("#event-detail-overlay"); 
    });
}

function onCompleteButtonClick(providerId, eventId) {
    hideForm("#event-detail-overlay"); 
    showForm("#event-complete-overlay"); 
}

function onCompleteConfirmClick(providerId, eventId) {    
    const outcome = parseInt($("#complete-options-list").val()); 
    api.completeEvent(providerId, eventId, outcome, (err, data) => {
        if (err) {
            showError(err); 
        }
        else {
            hideForm("#event-detail-overlay");
            hideForm("#event-complete-overlay");
            refreshEvents(providerId); 
        }
        hideForm("#event-detail-overlay"); 
    });
}

function onCreateEventButtonClick(providerId) {
    const name = $("#event-create-name-text").val();
    const rawOptions = $("#event-create-options-text").val(); 
    const dateString = $("#event-create-date-text").val(); 

    const options = []; 
    const items = rawOptions.split('\n'); 
    for (let n=0; n<items.length; n++) {
        const item = items[n].trim(); 
        if (item.length) {
            options.push(item);
        }
    }

    let date = 0; 
    if (dateString && dateString.length) {
        date = parseInt(dateString);
    }

    api.createEvent(providerId, name, options, date, (err, data) => {
        if (err) {
            common.showError(err); 
        }
        else {

            if (data) {            
                hideForm("#event-create-overlay"); 
                refreshEvents(providerId); 
            }
        }
    });
}


$(document).ready(() => {
    hideForm("#event-detail-overlay"); 
    hideForm("#event-create-overlay"); 
    hideForm("#event-complete-overlay"); 

    _providerId = common.getFromQuerystring("provider"); 
    refreshEvents(_providerId);

    $("#event-create-button").click(() => {
        clearCreateForm();
        showForm("#event-create-overlay"); 
    });

    $("#event-create-create-button").click(() => {
        onCreateEventButtonClick(_providerId);
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

    $("#close-create-dialog").click(() => {
        hideForm("#event-create-overlay")
    });

    $("#close-detail-dialog").click(() => {
        hideForm("#event-detail-overlay")
    });

    $("#event-complete-confirm-button").click(() => {
        onCompleteConfirmClick(_providerId, _currentEventId); 
    });

    $("#event-complete-cancel-button").click(() => {
        hideForm("#event-complete-overlay");
        showForm("#event-detail-overlay"); 
    });

    $("#show-all-checkbox").prop('checked', _showAll);
    $("#show-all-checkbox").change(function() {
        _showAll = this.checked;
        refreshEvents(_providerId);
    });
});
