const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const helper = require('./app.helper');

const app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

app.get('/api/sieve-number/:sieveNumber?', helper.sieveNumberHandler);

app.get('/', helper.defaultRouteHandler);

app.use(helper.clientErrorHandler);

module.exports = app;
