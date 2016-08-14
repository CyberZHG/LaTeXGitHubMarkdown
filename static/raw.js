/*jslint browser: true*/
/*global $, window, console, require, exports, marked*/

if (typeof require === 'function') {
    var marked = require('marked');
}

/**
 * Escape LaTeX formulas in the raw Markdown text.
 * @param {string} raw
 * @return {string}
 */
function escape(raw) {
    'use strict';
    var tokens;
    marked.setOptions({
        gfm: true,
        tables: true,
        breaks: true
    });
    tokens = marked.lexer(raw);
    console.log(tokens);
    return raw;
}

if (typeof require === 'function') {
    exports.escape = escape;
}

if (typeof require !== 'function') {
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

        getRawContent(function (success, raw) {
            if (success) {
                var url = 'https://api.github.com/markdown',
                    token = localStorage.getItem('latex_github_markdown_access_token'),
                    data = {
                        'text': escape(raw),
                        'mode': 'markdown'
                    };
                if (token) {
                    url += '?access_token=' + token;
                    data.access_token = token;
                }
                $.ajax({
                    url: url,
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
}
