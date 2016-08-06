/*global chrome*/
'use strict';

chrome.webNavigation.onDOMContentLoaded.addListener(function (details) {
    chrome.tabs.executeScript(details.tabId, {file: "render.js"});
});

chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
    chrome.tabs.executeScript(details.tabId, {file: "render.js"});
});
