angular.module('ChartsApp').service('node', function () {
    'use strict';

    var currentNode;

    var setNode = function (node) {
        currentNode = node;
    };

    return {
        setNode: setNode
    };
});
