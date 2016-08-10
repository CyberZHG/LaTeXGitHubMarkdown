/*jslint browser: true*/
/*global $, window*/

window.onload = function () {
    'use strict';
    var content = document.getElementById('local_frame').contentWindow,
        data = {
            key: 'test_' + Math.floor(Math.random() * 65535).toString(16),
            html: '<p>$$\frac{1}{2}</p>'
        };
    content.postMessage(JSON.stringify(data), '*');
};
