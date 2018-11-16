'use strict';

var app = angular.module('ChartsApp');

app.service('data', require('./data'));
app.service('filter', require('./filter'));
app.service('bus', require('./bus'));
app.service('node', require('./node'));
