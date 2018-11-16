module.exports = ['$scope', 'bus', 'CONST', function ($scope, bus, CONST) {
    'use strict';

    bus.on(CONST.EVENTS.DATA_UPDATE, function (data) {
        $scope.data = angular.copy(data);
    });
}];