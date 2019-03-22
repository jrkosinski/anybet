'use strict'; 

let _currentEventId = null; 
let _showAll = false;

function showEventDetail(evt) {
    _currentEventId = evt.id; 

    $("#event-detail-provider-div").text(evt.provider); 
    $("#event-detail-id-div").text(evt.id); 
    $("#event-detail-name-div").text(evt.name); 
    $("#event-detail-date-div").text(formatTimestamp(evt.date)); 
    $("#event-detail-options-div").empty(); 
    $("#event-detail-state-div").text(common.getStateName(evt.state)); 
    $("#event-detail-outcome-div").text(evt.outcome); 

    if (evt.options && evt.options.length) {
        for (let n=0; n<evt.options.length; n++) {
            $("#event-detail-options-div").append("<div>" + evt.options[n] + "</div>");
        }
    }
    showForm("#event-detail-overlay"); 
}

function clearCreateForm() {
    $("#event-create-provider-text").val(""); 
    $("#event-create-id-text").val(""); 
    $("#event-create-minbet-text").val(""); 
}

function onEventClick(eventId) {
    window.contracts.anybet.getEvent(eventId, (err, data) => {
        console.log(data);

        if (data) {
            const evtObj = {
                id: data[0],
                provider: data[1],
                name: data[3], 
                date: data[4].c[0],
                minimumBet: data[5].c[0],
                state: data[6].c[0],
                options: data[7].split("|"),
                
                outcome: data[9].c[0],
            }; 
            showEventDetail(evtObj); 
        }
    });
}

function refreshEvents() {
    const queryFunc = (_showAll) ? window.contracts.anybet.getAllEvents : window.contracts.anybet.getPendingEvents; 
    queryFunc((err, data) => {
        $("#events-list-div").empty();
        if (data && data.length) {
            for (let n=0; n<data.length; n++) {
                $("#events-list-div").append(getEventDivHtml({ id: data[n] })); 
            }
        }
    });
}

function getEventDivHtml(evt) {
    return `<div><a href="#" onclick="onEventClick('${evt.id}')" id="event-row-${evt.id}">${evt.id}</span></a>`
}

function onCreateEventButtonClick() {
    const provider = $("#event-create-provider-text").val();
    const eventId = $("#event-create-id-text").val(); 
    const minBetString = $("#event-create-minbet-text").val(); 
}


$(document).ready(() => {
    hideForm("#event-detail-overlay"); 
    hideForm("#event-create-overlay"); 

    console.log(Anybet);
    refreshEvents();

    $("#event-create-button").click(() => {
        clearCreateForm();
        showForm("#event-create-overlay"); 
    });

    $("#event-create-create-button").click(() => {
        onCreateEventButtonClick();
    });

    $("#event-create-cancel-button").click(() => {
        clearCreateForm();
        hideForm("#event-create-overlay"); 
    });

    $("#event-cancel-button").click(() => {
        onCancelButtonClick(_currentEventId); 
    });

    $("#close-create-dialog").click(() => {
        hideForm("#event-create-overlay")
    });

    $("#close-detail-dialog").click(() => {
        hideForm("#event-detail-overlay")
    });

    $("#show-all-checkbox").prop('checked', _showAll);
    $("#show-all-checkbox").change(function() {
        _showAll = this.checked;
        refreshEvents();
    });
});
