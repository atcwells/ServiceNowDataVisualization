module.exports = ['$scope', '$timeout', '$window', 'data', 'bus', 'node', 'CONST', function ($scope, $timeout, $window, data, bus, node, CONST) {
    'use strict';

    $scope.edit = false;
    $scope.data = null;
    $scope.selectedNode = null;

    var container = angular.element(document.querySelector('#panel'));
    var graph = document.querySelector('#graph');

    bus.on(CONST.EVENTS.DATA_UPDATE, function (updatedData) {
        var clonedData = angular.copy(updatedData);
        $scope.data = clonedData;
    });

    // Events
    container
        .on('hoverNode', function (event) {
            $scope.selectedNode = data.node.get('name', event.detail);
            $scope.edit = false;
            $scope.$apply();
        })
        .on('selectNode', function (event) {
            $scope.enterEdit(event.detail);
            $scope.selectedNode = data.node.get('name', event.detail);
            // data.setCurrentFocus({
            //     id: $scope.selectedNode.parent,
            //     children: [$scope.selectedNode]
            // });
            $scope.$apply();
        })
        .on('unSelectNode', function (event) {
            if ($scope.edit) {
                $scope.leaveEdit();
                $scope.$apply();
            }
        });

    $scope.enterEdit = function (name) {
        $scope.originalNode = data.node.get('name', name);
        $scope.node = angular.copy($scope.originalNode);
        // data.setJsonData(angular.copy($scope.originalNode));
        $scope.edit = true;

        // have to keep the host keys in an array to manage edition
        $scope.hostKeys = {};
        angular.forEach($scope.node.host, function (value, key) {
            $scope.hostKeys[key] = key;
        });
    };

    $scope.leaveEdit = function () {
        $scope.node = angular.copy($scope.originalNode);
        $scope.edit = false;
        bus.emit(CONST.EVENTS.UNSELECT_NODE);
    };

    $scope.editNode = function (form, $event) {
        $event.preventDefault();
        angular.forEach($scope.hostKeys, function (value, key) {
            if (value !== key) {
                $scope.node.host[value] = angular.copy($scope.node.host[key]);
                delete $scope.node.host[key];
            }
        });
        data.node.update($scope.originalNode.name, $scope.node);

        $scope.node = data.node.get('name', $scope.node.name);

        $scope.edit = false;
    };

    $scope.deleteNode = function () {
        if (!$window.confirm('Are you sure you want to delete that node?')) return;
        data.node.remove($scope.originalNode.name);

        $scope.edit = false;
    };

    $scope.moveNode = function () {
        var dest = $window.prompt('Please type the name of the parent node to move to');
        data.node.move($scope.originalNode.name, dest);

        $timeout(function () {
            bus.emit(CONST.EVENTS.SELECT_NODE, $scope.originalNode.name);
        });
    };

    $scope.addNode = function () {
        data.node.add($scope.originalNode.name);

        $timeout(function () {
            bus.emit(CONST.EVENTS.SELECT_NODE, 'New node');
        });
    };

    $scope.addDependency = function () {
        if (typeof ($scope.node.dependsOn) === 'undefined') {
            $scope.node.dependsOn = [];
        }
        $scope.node.dependsOn.push('');
    };

    $scope.deleteDependency = function (index) {
        $scope.node.dependsOn.splice(index, 1);
    };

    $scope.addTechno = function () {
        if (typeof ($scope.node.technos) === 'undefined')
            $scope.node.technos = [];

        $scope.node.technos.push('');
    };

    $scope.deleteTechno = function (index) {
        $scope.node.technos.splice(index, 1);
    };

    $scope.addHost = function (key) {
        if (typeof ($scope.node.host[key]) === 'undefined')
            $scope.node.host[key] = [];

        $scope.node.host[key].push('');
    };

    $scope.deleteHost = function (key, index) {
        $scope.node.host[key].splice(index, 1);
    };

    $scope.addHostCategory = function () {
        if (typeof ($scope.node.host) === 'undefined')
            $scope.node.host = {};

        $scope.node.host[''] = [];
        $scope.hostKeys[''] = '';
    };

    $scope.deleteHostCategory = function (key) {
        delete $scope.hostKeys[key];
        delete $scope.node.host[key];
    };
}];
