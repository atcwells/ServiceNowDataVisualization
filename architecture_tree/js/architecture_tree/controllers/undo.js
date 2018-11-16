module.exports = ['$scope', 'bus', 'data', 'CONST', function ($scope, bus, data, CONST) {

    var history = [];

    bus.on(CONST.EVENTS.DATA_UPDATE, function (data) {
        history.push(angular.copy(data));
    });

    $scope.hasHistory = function () {
        return history.length > 1;
    };

    $scope.undo = function () {
        history.pop(); // remove current state
        data.setJsonData(history.pop()); // restore previsous state
    };

}];
