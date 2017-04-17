/*jslint node: true */
/*global describe, it, toAbsoluteUrlSub */
'use strict';
var assert = require('assert'),
    render = require('../static/render.js');

var test_time_out = 1000 * 60 * 10;

describe('To Absolute Url', function () {
    it('/absolute/path', function (done) {
        assert.equal(render.toAbsoluteUrlSub('https://github.com', '/CyberZHG', '/absolute/path'), 'https://github.com/absolute/path');
        assert.equal(render.toAbsoluteUrlSub('https://github.com', '/CyberZHG/', '/absolute/path'), 'https://github.com/absolute/path');
        done();
    });
    it('relative/path', function (done) {
        assert.equal(render.toAbsoluteUrlSub('https://github.com', '/CyberZHG', 'relative/path'), 'https://github.com/CyberZHG/relative/path');
        assert.equal(render.toAbsoluteUrlSub('https://github.com', '/CyberZHG/', 'relative/path'), 'https://github.com/CyberZHG/relative/path');
        done();
    });
    it('127.0.0.1', function (done) {
        assert.equal(render.toAbsoluteUrlSub('https://github.com', '/CyberZHG', 'http://127.0.0.1/absolute/path'), 'https://github.com/absolute/path');
        assert.equal(render.toAbsoluteUrlSub('https://github.com', '/CyberZHG/', 'http://127.0.0.1/absolute/path'), 'https://github.com/absolute/path');
        done();
    });
    it('cyberzhg.github.io', function (done) {
        assert.equal(render.toAbsoluteUrlSub('https://github.com', '/CyberZHG', 'https://cyberzhg.github.io/absolute/path'), 'https://github.com/absolute/path');
        assert.equal(render.toAbsoluteUrlSub('https://github.com', '/CyberZHG/', 'https://cyberzhg.github.io/absolute/path'), 'https://github.com/absolute/path');
        assert.equal(render.toAbsoluteUrlSub('https://github.com', '/CyberZHG', 'https://cyberzhg.github.io/LaTeXGitHubMarkdown/static/relative/path'), 'https://github.com/CyberZHG/relative/path');
        assert.equal(render.toAbsoluteUrlSub('https://github.com', '/CyberZHG/', 'https://cyberzhg.github.io/LaTeXGitHubMarkdown/static/relative/path'), 'https://github.com/CyberZHG/relative/path');
        done();
    });
});
