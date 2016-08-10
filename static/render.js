/*jslint browser: true*/
/*global $, window*/
$(document).ready(function () {
    'use strict';
    /**
     * Get value from query string.
     * @param {string} name
     * @return {string}
     */
    window.getParameterByName = function (name) {
        var match = (new RegExp('[?&]' + name + '=([^&]*)')).exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    };

    /**
     * Add html to DOM.
     * @param {string} html
     */
    window.addRenderedToDom = function (html) {
        $('.markdown-body').html(html);
        var script = document.createElement('script');
        script.src = "https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
        $('.container').append(script);
    };
});
