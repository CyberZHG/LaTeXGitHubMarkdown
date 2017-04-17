/*jslint browser: true*/
/*global console, window, Blob, location*/

/** Add LaTeX buttons. */
function initLaTeX() {
    'use strict';

    /** The class names appeared in the tags of Markdown elements. */
    var TYPE_README = 'readme boxed-group',
        TYPE_FILE = 'file',
        TYPE_COMMENT = 'timeline-comment',
        TYPE_WIKI = 'wiki-body',

    /** The global Markdown elements. */
        elements = [];

    /**
     * Add new elements to the the global elements variable.
     * @param {HTMLCollection} elems The new elements.
     * @return {HTMLCollection} The global elements variable.
     */
    function addToElements(elems) {
        Array.prototype.forEach.call(elems, function (element) {
            elements.push(element);
        });
        return elements;
    }

    /** Find and add the Markdown elements to the global elements variable. */
    addToElements(document.getElementsByClassName(TYPE_README));
    addToElements(document.getElementsByClassName(TYPE_FILE));
    addToElements(document.getElementsByClassName(TYPE_COMMENT));
    addToElements(document.getElementsByClassName(TYPE_WIKI));

    /**
     * Get the current url without query string.
     * @return {string}
     */
    function getUrlWithoutQuery() {
        return [location.protocol, '//', location.host, location.pathname].join('');
    }

    /**
     * Open the page with MathJax inserted.
     *
     * @param {Element} element The element that triggered the convertion.
     *
     * @return {void}
     */
    function openWithLocal(html) {
        var frame = document.createElement('iframe');
        frame.setAttribute('hidden', true);
        document.body.appendChild(frame);
        frame.onload = function () {
            var url = 'https://cyberzhg.github.io/LaTeXGitHubMarkdown/static/html?',
                key = 'html_' + Math.floor(Math.random() * 65535).toString(16),
                data = {
                    key: key,
                    html: html
                };
            frame.contentWindow.postMessage(JSON.stringify(data), '*');
            url += 'key=' + key;
            url += '&origin=' + encodeURIComponent(getUrlWithoutQuery());
            url += '&escape=1';
            window.open(url);
        };
        frame.src = 'https://cyberzhg.github.io/LaTeXGitHubMarkdown/static/local';
    }

    /**
     * Add LaTeX button to an action group.
     *
     * The button inserted would have a class named 'btn-latex' added automatically.
     * This is used to prevent duplicated insertion.
     *
     * @param {Element} group The action group.
     * @param {string} className The class names of the button.
     * @param {string} html The rendered Markdown.
     *
     * @return {void}
     */
    function addButtonToGroup(group, className, html) {
        var lock = group.getElementsByClassName('btn-latex'),
            button = document.createElement('button');
        if (lock.length > 0) {
            return;
        }
        button.className = className + ' btn-latex';
        button.onclick = function () {
            openWithLocal(html);
        };
        button.innerHTML = 'LaTeX';
        group.appendChild(button);
    }

    /**
     * Add the LaTeX button to the Markdown element.
     *
     * @param {Element} element The Markdown element.
     *
     * @return {void}
     */
    function addOpenInNewTabButton(element) {
        var groups, gistElement, actions, header;
        /** Markdown files. */
        if (element.className.indexOf(TYPE_FILE) >= 0) {
            groups = element.getElementsByClassName('BtnGroup');
            if (groups.length > 0) {
                element = element.getElementsByClassName('markdown-body');
                if (element.length > 0) {
                    element = element[0].innerHTML;
                    addButtonToGroup(groups[0], 'btn btn-sm', element);
                }
                return;
            }
            /** Gist files. */
            groups = element.getElementsByClassName('file-actions');
            if (groups.length > 0) {
                gistElement = element.getElementsByClassName('gist-blob-name');
                if (gistElement.length > 0) {
                    gistElement = gistElement[0];
                    if (gistElement.innerHTML.trim().endsWith('.md')) {
                        element = element.getElementsByClassName('markdown-body');
                        if (element.length > 0) {
                            element = element[0].innerHTML;
                            addButtonToGroup(groups[0], 'btn btn-sm', element);
                        }
                        return;
                    }
                }
            }
        }
        /** Comments in issue. */
        if (element.className.indexOf(TYPE_COMMENT) >= 0) {
            groups = element.getElementsByClassName('timeline-comment-actions');
            if (groups.length > 0) {
                element = element.parentNode.getElementsByClassName('markdown-body');
                if (element.length > 0) {
                    element = element[0].innerHTML;
                    addButtonToGroup(groups[0], 'btn-link timeline-comment-action', element);
                }
                return;
            }
        }
        /** ReadMe files. */
        if (element.className.indexOf(TYPE_README) >= 0) {
            actions = element.getElementsByClassName('file-actions');
            header = element.getElementsByClassName('markdown-body');
            if (actions.length === 0) {
                if (header.length > 0) {
                    header = header[0];
                    actions = document.createElement('div');
                    actions.className = 'file-actions';
                    element.insertBefore(actions, element.firstChild);
                    groups = document.createElement('div');
                    groups.className = 'BtnGroup';
                    actions.appendChild(groups);
                    element = element.getElementsByClassName('markdown-body');
                    if (element.length > 0) {
                        element = element[0].innerHTML;
                        addButtonToGroup(groups, 'btn btn-sm', element);
                    }
                    return;
                }
            }
        }
        /** Wiki files. */
        if (element.className.indexOf(TYPE_WIKI) >= 0) {
            actions = element.getElementsByClassName('gh-header-actions');
            if (actions.length === 0) {
                actions = document.createElement('div');
                actions.className = 'gh-header-actions';
                element.insertBefore(actions, element.firstChild);
                element = element.getElementsByClassName('markdown-body');
                if (element.length > 0) {
                    element = element[0].innerHTML;
                    addButtonToGroup(actions, 'btn btn-sm', element);
                }
                return;
            }
        }
    }

    /** Iterate all the Markdown elements and add LaTeX buttons if needed. */
    elements.forEach(function (element) {
        if (element.innerHTML.indexOf('$') >= 0) {
            addOpenInNewTabButton(element);
        }
    });
}

initLaTeX();
