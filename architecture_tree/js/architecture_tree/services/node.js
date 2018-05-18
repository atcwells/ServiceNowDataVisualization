module.exports = function () {
    'use strict';

    var currentNode;

    var setNode = function (node) {
        currentNode = node;
    };

    return {
        setNode: setNode
    };
};
