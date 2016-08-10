/*jslint browser: true*/
/*global $, window*/
$(document).ready(function () {
    'use strict';

    /**
     * Read html from local storage.
     */
    function renderLocalHtml() {
        var key = window.getParameterByName('key'),
            html = localStorage.getItem(key);
        window.addRenderedToDom(html);
    }

    renderLocalHtml();
});
