/*jslint browser: true*/
/*global $, window, console*/
$(document).ready(function () {
    'use strict';

    var token = window.getParameterByName('token');
    localStorage.setItem('latex_github_markdown_access_token', token);
    setTimeout(function () {
        window.close();
    }, 10000);
});
