'use strict';
var app = angular.module('ChartsApp');

app.controller('chartCtrl', require('./chart'));
app.controller('jsonDataCtrl', require('./json-data'));
app.controller('panelCtrl', require('./panel'));
app.controller('undoCtrl', require('./undo'));
