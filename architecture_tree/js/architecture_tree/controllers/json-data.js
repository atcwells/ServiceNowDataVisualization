angular.module('ChartsApp').controller('jsonDataCtrl', function ($scope, bus, data) {
    'use strict';

    var previousData;
    $scope.data = null;

    bus.on('updateData', function (dat) {
        previousData = dat;
        $scope.data = JSON.stringify(data.getOriginalData(), undefined, 2);
    });

    $scope.updateData = function () {
        var newData = JSON.parse($scope.data);
        if (!angular.equals(newData, previousData)) {
            data.setJsonData(newData);
        }
    };
});
