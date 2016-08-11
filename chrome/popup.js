/*jslint browser: true*/
/*global $, chrome, window*/
$(document).ready(function () {
    'use strict';
    $('#button_inject').on('click', function () {
        chrome.tabs.query({active: true}, function (tabs) {
            chrome.tabs.executeScript(tabs[0].id, {file: "render.js"});
        });
        window.close();
    });
    $('#button_access').on('click', function () {
        chrome.tabs.create({url: 'https://github.com/login/oauth/authorize?client_id=17b967fc39122956bcc2'});
    });
    $('#button_github').on('click', function () {
        chrome.tabs.create({url: 'https://github.com/CyberZHG/LaTeXGitHubMarkdown/'});
    });
    $('#button_issues').on('click', function () {
        chrome.tabs.create({url: 'https://github.com/CyberZHG/LaTeXGitHubMarkdown/issues/'});
    });
});
