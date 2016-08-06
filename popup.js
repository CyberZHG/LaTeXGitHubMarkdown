$(document).ready(function () {
    $('#button_inject').on('click', function () {
        chrome.tabs.query({active: true}, function (tabs) {
            chrome.tabs.executeScript(tabs[0].id, {file: "render.js"});
        });
        window.close();
    });
    $('#button_github').on('click', function () {
        chrome.tabs.create({url: 'https://github.com/CyberZHG/LaTeXGitHubMarkdown/'});
    });
    $('#button_issues').on('click', function () {
        chrome.tabs.create({url: 'https://github.com/CyberZHG/LaTeXGitHubMarkdown/issues/'});
    });
});
