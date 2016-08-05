/*jslint browser: true*/
/*global console, window, Blob*/

window.onload = function () {
    'use strict';
    var elements = document.getElementsByClassName('markdown-body');

    function openInNewTab(element) {
        while (element && element.className.indexOf('file') === -1) {
            element = element.parentElement;
        }
        if (!element) {
            return;
        }
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(window.TEMPORARY, 1024 * 1024, function (fs) {
            var randomName = Math.floor(Math.random() * 268435455).toString(16) + '.html';
            fs.root.getFile(randomName, {
                create: true,
                exclusive: true
            }, function (file) {
                file.createWriter(function (writer) {
                    writer.onwriteend = function () {
                        window.open(file.toURL());
                    };
                    var html = document.head.innerHTML;
                    html += '<body>';
                    html += element.innerHTML;
                    html += '<script async src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>';
                    html += '<script type="text/x-mathjax-config">';
                    html += "MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['$$','$$']],displayMath: []}});";
                    html += '</script>';
                    html += '</body>';
                    var blob = new Blob([html], {type: 'text/plain'});
                    writer.write(blob);
                });
            });
        });
    }

    Array.prototype.forEach.call(elements, function (element) {
        if (element.innerHTML.indexOf('$$') >= 0) {
            openInNewTab(element);
        }
    });
};
