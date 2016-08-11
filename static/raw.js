/*jslint browser: true*/
/*global $, window, console*/
$(document).ready(function () {
    'use strict';

    /**
     * Get raw Markdown text from the given url in the query string.
     * @param {function} callback
     */
    function getRawContent(callback) {
        var url = window.getParameterByName('url');
        if (!url) {
            url = 'https://raw.githubusercontent.com/CyberZHG/LaTeXGitHubMarkdown/master/README.md';
        }
        $.ajax({
            url: url,
            success: function (data) {
                console.log('Get Raw: Success');
                callback(true, data);
            },
            error: function () {
                console.log('Get Raw: Error');
                callback(false);
            }
        });
    }

    /**
     * Escape LaTeX formulas in the raw Markdown text.
     * @param {string} raw
     * @return {string}
     */
    function escape(raw) {
        return raw;
    }

    getRawContent(function (success, raw) {
        if (success) {
            var token = localStorage.getItem('latex_github_markdown_access_token'),
                data = {
                    'text': escape(raw),
                    'mode': 'markdown'
                };
            console.log(token);
            if (token) {
                data.access_token = token;
            }
            $.ajax({
                url: 'https://api.github.com/markdown?access_token=' + token,
                type: 'POST',
                contentType: 'application/json',
                dataType: 'text',
                data: JSON.stringify(data),
                success: function (text) {
                    console.log('Render: Success');
                    window.addRenderedToDom(text);
                },
                error: function () {
                    console.log('Render: Error');
                }
            });
        }
    });
});
