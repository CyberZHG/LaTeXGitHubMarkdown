/*jslint browser: true*/
/*global $, window*/
$(document).ready(function () {
    'use strict';

    var DELETED_MESSAGE = '<h2>The key does not exist</h2>' +
            '<p>For security issues, the contents will be deleted immediately after first browsing.</p>' +
            '<p>Refresh the page will cause the contents inaccessiable.</p>';

    function simpleEscape(html) {
        html = html.replace(/\\left\s*\{/gi, '\\left \\{');
        html = html.replace(/\\right\s*\}/gi, '\\right \\}');
        html = html.replace(/\\\s*<br>/gi, '\\\\<br>');
        return html;
    }

    /**
     * Read html from local storage.
     */
    function renderLocalHtml() {
        var key = window.getParameterByName('key'),
            html = localStorage.getItem(key);
        localStorage.removeItem(key);
        if (html === null) {
            html = DELETED_MESSAGE;
        }
        html = simpleEscape(html);
        window.addRenderedToDom(html);
    }

    renderLocalHtml();

    window.onmessage = function (event) {
        if (!isNaN(event.data)) {
            if (parent.postMessage) {
                var height = document.getElementById('container').offsetHeight;
                parent.postMessage(height, '*');
            }
        }
    };

});
