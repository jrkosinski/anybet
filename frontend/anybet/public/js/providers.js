'use strict'; 

function refreshProviders() {
    api.getProviders((data, err) => {
        $("#providers-list-div").append(getProviderDivHtml({ id: "0xDB83D5291CCAce20949a21B5524C93F202E9B1ba" })); 
    });
}

function getProviderDivHtml(provider) {
    return `<div><a href="/events.html?provider=${provider.id}">${provider.id}</a></div>`
}

$(document).ready(() => {
    refreshProviders();
});
