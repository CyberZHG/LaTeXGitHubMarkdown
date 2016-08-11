'use strict';

const express = require('express');

const app = express();

app.get('/auth', function (req, res) {
    res.send('Auth');
});

app.listen(80, '0.0.0.0');
console.log('Running on 0.0.0.0:80');
