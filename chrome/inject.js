/*global chrome*/
'use strict';
chrome.webNavigation.onDOMContentLoaded.addListener(function (details) {
    if (details.url.indexOf('github.com') >= 0) {
        chrome.tabs.executeScript(details.tabId, {file: "render.js"});
    }
});
