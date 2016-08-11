/*jslint es6 */
'use strict';

const express = require('express');
const request = require('request');

const app = express();

app.get('/auth', function (req, res) {
    request.post({
        url: 'https://github.com/login/oauth/access_token',
        json: true,
        form: {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code: req.query.code
        }
    }, function (err, httpResponse, body) {
        if (err) {
            res.write(err);
            res.write(httpResponse);
        } else {
            res.redirect('https://cyberzhg.github.io/LaTeXGitHubMarkdown/static/access?token=' + body.access_token);
        }
        res.end();
    });
});

app.listen(80, '0.0.0.0');
console.log('Running on 0.0.0.0:80');
