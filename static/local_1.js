/*jslint browser: true*/
/*global $, window*/
window.onmessage = function (event) {
    'use strict';
    var data = JSON.parse(event.data);
    localStorage.setItem(data.key, event.data);
};
