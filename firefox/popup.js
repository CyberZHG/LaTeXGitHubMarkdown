/*jslint browser: true*/
/*global $, firefox, browser, window*/
$(document).ready(function () {
    'use strict';
    $('#button_inject').on('click', function () {
        browser.tabs.query({active: true}, function (tabs) {
            browser.tabs.executeScript(tabs[0].id, {file: "render.js"});
        });
        window.close();
    });
    $('#button_access').on('click', function () {
        browser.tabs.create({url: 'https://github.com/login/oauth/authorize?client_id=17b967fc39122956bcc2'});
        window.close();
    });
    $('#button_github').on('click', function () {
        browser.tabs.create({url: 'https://github.com/CyberZHG/LaTeXGitHubMarkdown/'});
        window.close();
    });
    $('#button_issues').on('click', function () {
        browser.tabs.create({url: 'https://github.com/CyberZHG/LaTeXGitHubMarkdown/issues/'});
        window.close();
    });
});
