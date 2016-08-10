/*jslint browser: true*/
/*global $*/
$(document).ready(function () {
    'use strict';
    window.addRenderedToDom = function (html) {
        $('.markdown-body').html(html);
        var script = document.createElement('script');
        script.src = "https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
        $('.container').append(script);
    };
});
