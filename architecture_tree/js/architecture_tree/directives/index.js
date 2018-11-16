'use strict';

var app = angular.module('ChartsApp');

app.directive('initFocus', require('./init-focus'));
app.directive('panelDetail', require('./panel-detail'));
app.directive('panelEdit', require('./panel-edit'));
app.directive('panelFilter', require('./panel-filter'));
app.directive('treeChart', require('./tree-chart'));
