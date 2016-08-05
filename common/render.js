/*jslint browser: true*/
/*global console, window, Blob*/

function initLaTeX() {
    'use strict';
    var TYPE_FILE = 'file';
    var TYPE_COMMENT = 'timeline-comment';

    var elements = [];

    function addToElements(elems) {
        Array.prototype.forEach.call(elems, function (element) {
            elements.push(element);
        });
    }

    addToElements(document.getElementsByClassName(TYPE_FILE));
    addToElements(document.getElementsByClassName(TYPE_COMMENT));

    function openInNewTab(element) {
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

    function addOpenInNewTabButton(element) {
        var groups, group, lock, button;
        if (element.className.indexOf(TYPE_FILE) >= 0) {
            groups = element.getElementsByClassName('btn-group');
            if (groups.length === 0) {
                return;
            }
            group = groups[0];
            lock = group.getElementsByClassName('btn-latex');
            if (lock.length > 0) {
                return;
            }
            button = document.createElement('a');
            button.className = 'btn btn-sm btn-latex';
            button.onclick = function () {
                openInNewTab(element);
            };
            button.href = '';
            button.innerHTML = 'LaTeX';
            group.appendChild(button);
        }
        if (element.className.indexOf(TYPE_COMMENT) >= 0) {
            groups = element.getElementsByClassName('timeline-comment-actions');
            if (groups.length === 0) {
                return;
            }
            group = groups[0];
            lock = group.getElementsByClassName('btn-latex');
            if (lock.length > 0) {
                return;
            }
            button = document.createElement('a');
            button.className = 'btn-link timeline-comment-action btn-latex';
            button.onclick = function () {
                openInNewTab(element);
            };
            button.href = '';
            button.innerHTML = 'LaTeX';
            group.appendChild(button);
        }
    }

    elements.forEach(function (element) {
        if (element.innerHTML.indexOf('$$') >= 0) {
            addOpenInNewTabButton(element);
        }
    });
}

initLaTeX();
