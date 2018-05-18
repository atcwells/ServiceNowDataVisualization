'use strict';

let app = require('angular').module('ChartsApp');

app.service('bus', require('./bus'));
app.service('data', require('./data'));
app.service('node', require('./node'));
