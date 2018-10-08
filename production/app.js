const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const helper = require('./app.helper');

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
}

app.use(bodyParser.json());

app.post('/api/update-exchange-data-bulk', helper.updateDBBulkHandler);
app.post('/api/update-exchange-data', helper.updateDBHandler);

app.get('/', helper.defaultRouteHandler);

app.use(helper.clientErrorHandler);

module.exports = app;
