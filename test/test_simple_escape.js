/*jslint node: true */
/*global describe, it */
'use strict';
var assert = require('assert'),
    raw = require('../static/raw.js');

var test_time_out = 1000 * 60 * 10;

describe('Simple Escape', function () {
    it('single', function (done) {
        assert.equal(raw.escape('$\\left$'), '$\\\\left$');
        assert.equal(raw.escape('$a_1$'), '$a\\_1$');
        done();
    });
    it('double', function (done) {
        assert.equal(raw.escape('$$\\left$$'), '$$\\\\left$$');
        assert.equal(raw.escape('$$a_1$$'), '$$a\\_1$$');
        done();
    });
    it('multi', function (done) {
        assert.equal(raw.escape('$$\\left$$ $a_1$'), '$$\\\\left$$ $a\\_1$');
        done();
    });
    it('no-pair', function (done) {
        assert.equal(raw.escape('$$\\left$a_1$$'), '$$\\left$a_1$$');
        assert.equal(raw.escape('$\\left$$a_1$'), '$\\left$$a_1$');
        done();
    });
});
