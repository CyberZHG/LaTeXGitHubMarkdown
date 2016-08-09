/*jslint browser: true*/
/*global $*/
$(document).ready(function () {
    'use strict';

    /**
     * Get value from query string.
     * @param {string} name
     * @return {string}
     */
    function getParameterByName(name) {
        var match = (new RegExp('[?&]' + name + '=([^&]*)')).exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }

    /**
     * Get raw Markdown text from the given url in the query string.
     * @param {function} callback
     */
    function getRawContent(callback) {
        var url = getParameterByName('url');
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
            var data = {
                'text': escape(raw),
                'mode': 'markdown'
            };
            $.ajax({
                url: 'https://api.github.com/markdown',
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
