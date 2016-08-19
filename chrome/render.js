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
     * Due to GitHub's strict content security policy, MathJax could not be inserted in the same page.
     * The new page uses the local file system, the function will not work if file system is disabled.
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
     * @param {string} rawUrl
     *
     * @return {void}
     */
    function addButtonToGroup(group, className, html, rawUrl) {
        var lock = group.getElementsByClassName('btn-latex'),
            button = document.createElement('button');
        if (lock.length > 0) {
            return;
        }
        button.className = className + ' btn-latex';
        button.onclick = function () {
            if (rawUrl === undefined) {
                openWithLocal(html);
            } else {
                var url = 'https://cyberzhg.github.io/LaTeXGitHubMarkdown/static/raw?';
                url += 'url=' + encodeURIComponent(rawUrl);
                url += '&origin=' + encodeURIComponent(getUrlWithoutQuery());
                url += '&escape=1';
                window.open(url);
            }
        };
        button.innerHTML = 'LaTeX';
        group.appendChild(button);
    }

    /**
     * Check if the current repository is private.
     * @return {boolean}
     */
    function isPrivateRepo() {
        return document.getElementsByClassName('label-private').length > 0;
    }

    /**
     * Generate raw.githubusercontent.com url for raw file.
     * @param {string} rawUrl
     * @return {string}
     */
    function constructRawGitHubUserContentUrl(rawUrl) {
        var parts = rawUrl.split('/');
        rawUrl = parts.slice(0, 3).concat(parts.slice(4)).join('/');
        return 'https://raw.githubusercontent.com' + rawUrl;
    }

    /**
     * Generate gist.githubusercontent.com url for raw file.
     * @param {string} rawUrl
     * @return {string}
     */
    function constructGistGitHubUserContentUrl(rawUrl) {
        return 'https://gist.githubusercontent.com' + rawUrl;
    }

    /**
     * Generate raw.githubusercontent.com url for wiki file.
     * @param {string} rawUrl
     * @return {string}
     */
    function constructWikiGitHubUserContentUrl(rawUrl) {
        var parts = rawUrl.split('/');
        rawUrl = parts.slice(0, 3).concat(parts.slice(4)).join('/');
        return 'https://raw.githubusercontent.com/wiki' + rawUrl + '.md';
    }

    /**
     * Generate raw.githubusercontent.com url for README.md file.
     * @param {string} rawUrl
     * @return {string}
     */
    function constructReadMeGitHubUserContentUrl(rawUrl) {
        var parts = rawUrl.split('/');
        if (parts.length === 3) {
            rawUrl = parts.slice(0, 3).concat(parts.slice(4)).concat('master').join('/');
        } else {
            rawUrl = parts.slice(0, 3).concat(parts.slice(4)).join('/');
        }
        return 'https://raw.githubusercontent.com' + rawUrl + '/README.md';
    }

    /**
     * Add the LaTeX button to the Markdown element.
     *
     * @param {Element} element The Markdown element.
     *
     * @return {void}
     */
    function addOpenInNewTabButton(element) {
        var groups, gistElement, actions, header, url;
        /** Markdown files. */
        if (element.className.indexOf(TYPE_FILE) >= 0) {
            groups = element.getElementsByClassName('btn-group');
            if (groups.length > 0) {
                if (isPrivateRepo()) {
                    element = element.getElementsByClassName('markdown-body');
                    if (element.length > 0) {
                        element = element[0].innerHTML;
                        addButtonToGroup(groups[0], 'btn btn-sm', element);
                    }
                } else {
                    url = document.getElementById('raw-url').getAttribute('href');
                    url = constructRawGitHubUserContentUrl(url);
                    addButtonToGroup(groups[0], 'btn btn-sm', '', url);
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
                        url = groups[0].getElementsByClassName('btn')[0].getAttribute('href');
                        url = constructGistGitHubUserContentUrl(url);
                        addButtonToGroup(groups[0], 'btn btn-sm', '', url);
                        return;
                    }
                }
            }
        }
        /** Comments in issue. */
        if (element.className.indexOf(TYPE_COMMENT) >= 0) {
            groups = element.getElementsByClassName('timeline-comment-actions');
            if (groups.length > 0) {
                element = element.getElementsByClassName('markdown-body');
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
                    groups.className = 'btn-group';
                    actions.appendChild(groups);
                    if (isPrivateRepo()) {
                        element = element.getElementsByClassName('markdown-body');
                        if (element.length > 0) {
                            element = element[0].innerHTML;
                            addButtonToGroup(groups, 'btn btn-sm', element);
                        }
                    } else {
                        url = window.location.pathname;
                        url = constructReadMeGitHubUserContentUrl(url);
                        addButtonToGroup(groups, 'btn btn-sm', '', url);
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
                if (isPrivateRepo()) {
                    element = element.getElementsByClassName('markdown-body');
                    if (element.length > 0) {
                        element = element[0].innerHTML;
                        addButtonToGroup(actions, 'btn btn-sm', element);
                    }
                } else {
                    url = window.location.pathname;
                    url = constructWikiGitHubUserContentUrl(url);
                    addButtonToGroup(actions, 'btn btn-sm', '', url);
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
