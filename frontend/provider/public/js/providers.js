'use strict'; 

function refreshProviders() {
    api.getProviders((data, err) => {
        if (err) {
            common.showError(err); 
        }
        else {
            $("#providers-list-div").empty();
            if (data && data.length) {
                for (let n=0; n<data.length; n++) {
                    $("#providers-list-div").append(getProviderDivHtml(data[n])); 
                }
            }
        }
    });
}

function getProviderDivHtml(provider) {
    return `<div><a href="/events.html?provider=${provider.id}">${provider.id}</a></div>`
}

$(document).ready(() => {
    refreshProviders();
});
