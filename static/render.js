/*jslint browser: true*/
/*global $, window, require, exports*/

/**
 * Change relative url to absolute url.
 * @param {string} domain
 * @param {string} path
 * @param {string} url
 * @return {string}
 */
function toAbsoluteUrlSub(domain, path, url) {
    'use strict';
    if (!url || url.indexOf('://') >= 0) {
        if (url.indexOf('https://cyberzhg.github.io/') >= 0 || url.indexOf('http://127.0.0.1/') >= 0) {
            url = url.split('/').slice(3).join('/');
            if (url.substring(0, 6) === 'static') {
                url = url.substring(url.indexOf('/') + 1);
            } else {
                url = '/' + url;
            }
        } else {
            return url;
        }
    }
    if (url[0] === '/') {
        return domain + url;
    }
    if (path.slice(-1) !== '/') {
        path = path + '/';
    }
    return domain + path + url;
}

if (typeof require === 'function') {
    exports.toAbsoluteUrlSub = toAbsoluteUrlSub;
}

if (typeof require !== 'function') {
    $(document).ready(function () {
        'use strict';
        /**
         * Get value from query string.
         * @param {string} name
         * @return {string}
         */
        window.getParameterByName = function (name) {
            var match = (new RegExp('[?&]' + name + '=([^&]*)')).exec(window.location.search);
            return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        };

        /**
         * Change relative url to absolute url.
         */
        function toAbsoluteUrl() {
            var origin = window.getParameterByName('origin'),
                a = document.createElement('a'),
                domain,
                path;
            if (!origin) {
                return;
            }
            a.href = origin;
            domain = a.origin; // https://github.com
            path = a.pathname.substring(0, a.pathname.lastIndexOf('/') + 1); // /CyberZHG[/]
            $('.markdown-body').find('a').each(function (index, a) {
                index = index + 1; // To pass jslint.
                a.href = toAbsoluteUrlSub(domain, path, a.href);
            });
            $('.markdown-body').find('img').each(function (index, img) {
                index = index + 1; // To pass jslint.
                img.src = toAbsoluteUrlSub(domain, path, img.src);
                img.src = img.src.replace('/blob/', '/raw/');
            });
        }

        /**
         * Add html to DOM.
         * @param {string} html
         */
        window.addRenderedToDom = function (html) {
            $('.markdown-body').html(html);
            toAbsoluteUrl();
            var script = document.createElement('script');
            script.src = "https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
            $('.container').append(script);
            $('.markdown-body').attr('finished', true);
        };
    });
}
