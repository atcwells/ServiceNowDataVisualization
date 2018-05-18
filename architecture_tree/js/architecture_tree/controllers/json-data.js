module.exports = function ($scope, bus, data, CONST) {
    'use strict';

    var previousData;
    $scope.data = null;

    bus.on(CONST.EVENTS.DATA_UPDATE, function (dat) {
        previousData = dat;
        $scope.data = JSON.stringify(data.getJsonData(), undefined, 2);
    });

    $scope.updateData = function () {
        var newData = JSON.parse($scope.data);
        if (!angular.equals(newData, previousData)) {
            data.setJsonData(newData);
        }
    };
};
