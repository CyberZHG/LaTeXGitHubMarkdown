/*jslint browser: true*/
/*global console, window, Blob*/

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
     * Try to recover from the conflict of LaTeX and Markdown.
     *
     * @param {Element} element
     *
     * @return {string} The recovered HTML string.
     */
    function recover(element) {

        var ELEMENT_TYPE_LATEX = 'latex',
            ELEMENT_TYPE_LEAF = 'leaf',
            ELEMENT_TYPE_INNER = 'inner';

        /**
         * Find and distinguish the LaTeX parts and other HTML parts.
         *
         * @param {Element} element
         *
         * @return {object} A tree-shaped object.
         *     The corresponding value of the key 'type' could be 'latex', 'inner' and 'leaf'.
         *     If the 'type' is 'latex', then a 'text' field must provided containing the raw LaTeX formula.
         *     If the 'type' is 'inner', the corresponding value of the key 'child' is an array contains the
         *     children objects in a sequential order.
         *     If the 'type' is 'leaf', then a 'text' field must provided containing the HTML text.
         *     without the opening and ending symbol.
         */
        function parse(element) {
            if (!element.children.hasOwnProperty('length') || element.children.length === 0) {
                return {
                    'type': ELEMENT_TYPE_LEAF,
                    'child': [],
                    'text': element.outerHTML
                };
            }
            return {
                'type': ELEMENT_TYPE_INNER,
                'child': Array.prototype.map.call(element.childNodes, parse),
                'open': '<' + element.tagName + Array.prototype.map.call(element.attributes, function (attr) {
                    return ' ' + attr.name + '="' + attr.value.replace('"', '&quot;') + '"';
                }).join('') + '>',
                'close': '</' + element.tagName + '>'
            };
        }

        /**
         * The actual recovery function.
         *
         * @param {object} latex
         *
         * @return {object} Same as the parameter.
         */
        function recoverElement(latex) {
            return latex;
        }

        /**
         * Iterate the parsed element and try to recover.
         *
         * @param {object} element
         *
         * @return {object} Same structure with the parsed element.
         */
        function recoverElements(element) {
            if (element.type === ELEMENT_TYPE_LATEX) {
                return recoverElement(element);
            }
            if (element.type === ELEMENT_TYPE_LEAF) {
                return element;
            }
            if (element.type === ELEMENT_TYPE_INNER) {
                element.child = element.child.map(recoverElements);
                return element;
            }
            throw 'Unexpected end of function';
        }

        /**
         * Convert the parsed and recovered elements to HTML string.
         *
         * @param {object} element The recovered element.
         *
         * @return {string} HTML string.
         */
        function toString(element) {
            if (element.type === ELEMENT_TYPE_LATEX) {
                return '$$' + element.text + '$$';
            }
            if (element.type === ELEMENT_TYPE_LEAF) {
                return element.text;
            }
            if (element.type === ELEMENT_TYPE_INNER) {
                return element.open + element.child.map(toString).join('') + element.close;
            }
            throw 'Unexpected end of function';
        }

        return toString(recoverElements(parse(element)));
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
                    html += recover(element);
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

    /**
     * Add LaTeX button to an action group.
     *
     * The button inserted would have a class named 'btn-latex' added automatically.
     * This is used to prevent duplicated insertion.
     *
     * @param {Element} group The action group.
     * @param {Element} element The Markdown element.
     * @param {string} className The class names of the button.
     *
     * @return {void}
     */
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

    /**
     * Add the LaTeX button to the Markdown element.
     *
     * @param {Element} element The Markdown element.
     *
     * @return {void}
     */
    function addOpenInNewTabButton(element) {
        var groups, gistElement, actions, header;
        /** Gist files. */
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
        /** Comments in issue. */
        if (element.className.indexOf(TYPE_COMMENT) >= 0) {
            groups = element.getElementsByClassName('timeline-comment-actions');
            if (groups.length > 0) {
                addButtonToGroup(groups[0], element, 'btn-link timeline-comment-action');
                return;
            }
        }
        /** Markdown files. */
        if (element.className.indexOf(TYPE_README) >= 0) {
            actions = element.getElementsByClassName('file-actions');
            header = element.getElementsByClassName('markdown-body');
            if (actions.length === 0) {
                if (header.length > 0) {
                    header = header[0];
                    actions = document.createElement('div');
                    actions.className = 'file-actions';
                    header.insertBefore(actions, header.firstChild);
                    groups = document.createElement('div');
                    groups.className = 'btn-group';
                    actions.appendChild(groups);
                    addButtonToGroup(groups, element, 'btn btn-sm');
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
                addButtonToGroup(actions, element, 'btn btn-sm');
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
