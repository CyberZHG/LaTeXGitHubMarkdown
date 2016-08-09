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
     * Get request.
     * @param {string} url
     * @param {function} callback The first parameter is the request boolean result, the second parameter is the text.
     * @return {string}
     */
    function get(url, callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', url);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === XMLHttpRequest.DONE) {
                if (xmlhttp.status === 200) {
                    callback(true, xmlhttp.responseText);
                } else {
                    callback(false, xmlhttp.statusText);
                }
            }
        };
        xmlhttp.send();
    }

    /**
     * Post request.
     * @param {string} url
     * @param {function} callback The first parameter is the request boolean result, the second parameter is the text.
     * @return {string}
     */
    function post(url, data, callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', url);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === XMLHttpRequest.DONE) {
                if (xmlhttp.status === 200) {
                    callback(true, xmlhttp.responseText);
                } else {
                    callback(false, xmlhttp.statusText);
                }
            }
        };
        xmlhttp.send(data);
    }

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
     * Generate HTML with raw Markdown text.
     * First escape the escape characters in raw text, then use GitHub API to compile the text.
     *
     * @param {string} url The url that holds the raw Markdown text.
     * @param {function} callback The first parameter is the compiled text.
     */
    function reRender(url, callback) {
        /**
         * Add escape characters to LaTeX fomulas.
         * @param {string} raw Raw Markdown text.
         * @return {string} The escaped Markdown.
         */
        function escapeLaTeXs(raw) {
            /**
             * Escape LaTeX formular.
             *
             * @param {string} raw
             * @param {number} begin
             * @param {number} end
             *
             * @return {string}
             */
            function escapeLaTex(raw, begin, end) {
                var idx = begin,
                    escaped = '';
                while (idx < end) {
                    if (raw[idx] === '\\') {
                        escaped += '\\\\';
                    } else {
                        escaped += raw[idx];
                    }
                }
                return escaped;
            }

            var idx = 0,
                beginIdx = -1,
                dollarNum = 0,
                isEscaped = false,
                c,
                dollarBegin,
                escaped = '';
            while (idx < raw.length) {
                c = raw[idx];
                if (isEscaped) {
                    escaped += c;
                    isEscaped = false;
                } else {
                    if (c === '\\') {
                        escaped += c;
                        isEscaped = true;
                    } else {
                        if (c === '$') {
                            dollarBegin = idx;
                            while (idx < raw.length && raw[idx] === '$') {
                                idx += 1;
                            }
                        }
                        if (beginIdx === -1) {
                            escaped += raw.slice(dollarBegin, idx);
                            dollarNum = idx - dollarBegin;
                            if (dollarNum <= 2) {
                                beginIdx = idx;
                            }
                        } else {
                            if (idx - dollarBegin === dollarNum) {
                                escaped += escapeLaTex(raw, beginIdx, idx);
                            } else {
                                escaped += raw.slice(beginIdx, idx);
                            }
                        }
                    }
                }
                idx += 1;
            }
            return escaped;
        }

        get(url, function (success, text) {
            if (success) {
                var data = {
                    'text': escapeLaTeXs(text),
                    'mode': 'gfm'
                };
                post('https://api.github.com/markdown/raw', data, function (success, text) {
                    if (success) {
                        callback(text);
                    }
                });
            }
        });
    }

    /**
     * Open the page with MathJax inserted.
     *
     * Due to GitHub's strict content security policy, MathJax could not be inserted in the same page.
     * The new page uses the local file system, the function will not work if file system is disabled.
     *
     * @param {function} render The parameter is a callback function that takes the rendered text.
     */
    function openInNewTab(render) {
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
                    render(function (rendered) {
                        html += '<body>';
                        html += rendered;
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
        });
    }

    /**
     * Add LaTeX button to an action group.
     *
     * The button inserted would have a class named 'btn-latex' added automatically.
     * This is used to prevent duplicated insertion.
     *
     * @param {Element} group The action group.
     * @param {string} className The class names of the button.
     * @param {function} render The parameter is a callback function that takes the rendered text.
     */
    function addButtonToGroup(group, className, render) {
        var lock = group.getElementsByClassName('btn-latex'),
            button = document.createElement('button');
        if (lock.length > 0) {
            return;
        }
        button.className = className + ' btn-latex';
        button.onclick = function () {
            openInNewTab(render);
        };
        button.innerHTML = 'LaTeX';
        group.appendChild(button);
    }

    /**
     * Add the LaTeX button to the Markdown element.
     *
     * @param {Element} element The Markdown element.
     */
    function addOpenInNewTabButton(element) {
        var groups, gistElement, actions, header;
        /** Gist files. */
        if (element.className.indexOf(TYPE_FILE) >= 0) {
            groups = element.getElementsByClassName('btn-group');
            if (groups.length > 0) {
                addButtonToGroup(groups[0], 'btn btn-sm', function (callback) {
                    var url = document.getElementById('raw-url').getAttribute('href');
                    reRender(url, callback);
                });
                return;
            }
            groups = element.getElementsByClassName('file-actions');
            if (groups.length > 0) {
                gistElement = element.getElementsByClassName('gist-blob-name');
                if (gistElement.length > 0) {
                    gistElement = gistElement[0];
                    if (gistElement.innerHTML.trim().endsWith('.md')) {
                        addButtonToGroup(groups[0], 'btn btn-sm', function (callback) {
                            callback(recover(element));
                        });
                        return;
                    }
                }
            }
        }
        /** Comments in issue. */
        if (element.className.indexOf(TYPE_COMMENT) >= 0) {
            groups = element.getElementsByClassName('timeline-comment-actions');
            if (groups.length > 0) {
                addButtonToGroup(groups[0], 'btn-link timeline-comment-action', function (callback) {
                    callback(recover(element));
                });
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
                    addButtonToGroup(groups, 'btn btn-sm', function (callback) {
                        callback(recover(element));
                    });
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
                addButtonToGroup(actions, element, 'btn btn-sm', function (callback) {
                    callback(recover(element));
                });
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
