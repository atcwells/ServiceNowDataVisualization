'use strict';

angular.module('ChartsApp', [])
    .constant('CONST', {
        EVENTS: {
            DATA_UPDATE: 'updateData',
            FILTER_CHANGE: 'filterChange',
            SELECT_NODE: 'select',
            UNSELECT_NODE: 'unselect'
        }
    })
    .run(function (data) {
        data.fetchJsonData().then(function (response) {
            console.log('data loaded');
            console.log(response);
        }, console.error);
    });

require('./services');
require('./controllers');
require('./directives');