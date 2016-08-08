/*jslint browser: true*/
/*global console, window, Blob*/

function initLaTeX() {
    'use strict';
    var TYPE_README = 'readme boxed-group',
        TYPE_FILE = 'file',
        TYPE_COMMENT = 'timeline-comment',
        TYPE_WIKI = 'wiki-body',

        elements = [];

    function addToElements(elems) {
        Array.prototype.forEach.call(elems, function (element) {
            elements.push(element);
        });
    }

    addToElements(document.getElementsByClassName(TYPE_README));
    addToElements(document.getElementsByClassName(TYPE_FILE));
    addToElements(document.getElementsByClassName(TYPE_COMMENT));
    addToElements(document.getElementsByClassName(TYPE_WIKI));

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
                    var html = document.head.innerHTML,
                        blob;
                    html += '<body>';
                    html += element.innerHTML;
                    html += '<script async src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>';
                    html += '<script type="text/x-mathjax-config">';
                    html += "MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['$$','$$']],displayMath: []}});";
                    html += '</script>';
                    html += '</body>';
                    blob = new Blob([html], {type: 'text/plain'});
                    writer.write(blob);
                });
            });
        });
    }

    function addButtonToGroup(group, element, className) {
        var lock = group.getElementsByClassName('btn-latex'),
            button = document.createElement('button');
        if (lock.length > 0) {
            return;
        }
        button.className = className + ' btn-latex';
        button.onclick = function () {
            openInNewTab(element);
        };
        button.innerHTML = 'LaTeX';
        group.appendChild(button);
    }

    function addOpenInNewTabButton(element) {
        var groups, gistElement, actions, header;
        if (element.className.indexOf(TYPE_FILE) >= 0) {
            groups = element.getElementsByClassName('btn-group');
            if (groups.length > 0) {
                addButtonToGroup(groups[0], element, 'btn btn-sm');
                return;
            }
            groups = element.getElementsByClassName('file-actions');
            if (groups.length > 0) {
                gistElement = element.getElementsByClassName('gist-blob-name');
                if (gistElement.length > 0) {
                    gistElement = gistElement[0];
                    if (gistElement.innerHTML.trim().endsWith('.md')) {
                        addButtonToGroup(groups[0], element, 'btn btn-sm');
                        return;
                    }
                }
            }
        }
        if (element.className.indexOf(TYPE_COMMENT) >= 0) {
            groups = element.getElementsByClassName('timeline-comment-actions');
            if (groups.length > 0) {
                addButtonToGroup(groups[0], element, 'btn-link timeline-comment-action');
                return;
            }
        }
        if (element.className.indexOf(TYPE_README) >= 0) {
            actions = element.getElementsByClassName('file-actions');
            header = element.getElementsByTagName('h3');
            if (actions.length === 0) {
                if (header.length > 0) {
                    header = header[0];
                    actions = document.createElement('div');
                    actions.className = 'file-actions';
                    header.appendChild(actions);
                    groups = document.createElement('div');
                    groups.className = 'btn-group';
                    actions.appendChild(groups);
                    addButtonToGroup(groups, element, 'btn btn-sm');
                    return;
                }
            }
        }
        if (element.className.indexOf(TYPE_WIKI) >= 0) {
            actions = element.getElementsByClassName('gh-header-actions');
            if (actions.length === 0) {
                actions = document.createElement('div');
                actions.className = 'gh-header-actions';
                element.insertBefore(actions, element.firstChild);
                addButtonToGroup(actions, element, 'btn btn-sm');
                return;
            }
        }
    }

    elements.forEach(function (element) {
        if (element.innerHTML.indexOf('$') >= 0) {
            addOpenInNewTabButton(element);
        }
    });
}

initLaTeX();
