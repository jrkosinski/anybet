'use strict'; 

let _currentEventId = null; 
let _currentEvent = null; 
let _showAll = false;

function showEventDetail(evt) {
    _currentEventId = evt.id; 
    _currentEvent = evt;
    hideForm("#event-bet-form"); 

    $("#event-detail-provider-div").text(evt.providerAddress); 
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
    api.getEventDetails(eventId, (data, err) => {
        console.log(data);

        if (data) {
            showEventDetail(data); 
        }
    });
}

function refreshEvents() {
    api.getEvents(_showAll, (data, err) => {
        $("#events-list-div").empty();
        
        if (data && data.length) {
            for (let n=0; n<data.length; n++) {
                $("#events-list-div").append(getEventDivHtml({ id: data[n].id })); 
            }
        }
    });
}

function getEventDivHtml(evt) {
    return `<div><a href="#" onclick="onEventClick('${evt.id}')" id="event-row-${evt.id}">${evt.id}</span></a>`
}

function onCreateEventButtonClick() {
    const providerId = $("#event-create-provider-text").val();
    const eventId = $("#event-create-id-text").val(); 
    const minBet = Math.abs(parseInt($("#event-create-minbet-text").val()));

    api.addEvent(providerId, eventId, minBet, (data, err) => {
        console.log(data);

        if (data) {
            refreshEvents(); 
        }
    }); 
}

function onPlaceBetButtonClick(evt) {
    $("#bet-outcome-list").empty(); 

    if (_currentEvent) {
        if (_currentEvent.options && _currentEvent.options.length) {
            for (let n=0; n<_currentEvent.options.length; n++) {
                $("#bet-outcome-list").append(`<option value="${n}">${_currentEvent.options[n]}</option>`)
            }
        }

        //prepopulate min bet 
        $("#bet-amount-text").val(_currentEvent.minimumBet); 
    }

    showForm("#event-bet-form"); 
}

function onConfirmBetButtonClick(eventId) {
    const betAmount = parseInt($("#bet-amount-text").val()); 
    const outcome = $("#bet-outcome-list").val(); 
    const outcomeText = $("#bet-outcome-list option:selected").text();

    //validate min bet 
    if (betAmount < _currentEvent.minimumBet) {
        alert('Minimum bet is ' + _currentEvent.minimumBet); 
    }
    else {
        if (confirm(`You are about to place a bet for ${betAmount} on ${outcomeText}. Do you want to go ahead?`)) {
            window.contracts.anybet.placeBet(providerId, eventId, outcome, { amount: betAmount }, (data, err) => {
                console.log(data);
        
                if (data) {
                    refreshEvents(); 
                }
            });
        }
    }
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

    $("#place-bet-button").click(() => {
        onPlaceBetButtonClick(_currentEvent); 
    });

    $("#confirm-bet-button").click(() => {
        onConfirmBetButtonClick(_currentEventId); 
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
