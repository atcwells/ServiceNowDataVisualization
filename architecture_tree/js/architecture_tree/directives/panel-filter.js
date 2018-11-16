module.exports = ['CONST', 'bus', 'data', function (CONST, bus, data) {
    return {
        restrict: 'E',
        link: function link(scope, element, attrs) {

            bus.on(CONST.EVENTS.DATA_UPDATE, function (data) {
                scope.controls = computeControls(data);
            });

            scope.nameFilter = '';
            var controlsFilter = {};

            scope.$watch('nameFilter', function (name) {
                data.filter.setNameFilter(name);
            });

            scope.toggleControlsFilter = function (control) {
                if (scope.isControlInFilter(control)) {
                    delete controlsFilter[control.id];
                } else {
                    controlsFilter[control.id] = control;
                }
                bus.emit(CONST.EVENTS.FILTER_CHANGE);
            };

            scope.isControlInFilter = function (control) {
                return controlsFilter[control.id] !== undefined;
            };

            function computeControls(rootNode) {
                var controls = {};

                function addNodeControls(node) {
                    if (node.controls) {
                        node.controls.forEach(function (control) {
                            controls[control.id] = control;
                        });
                    }
                    if (node.children) {
                        node.children.forEach(function (childNode) {
                            addNodeControls(childNode);
                        });
                    }
                }

                addNodeControls(rootNode);

                return controls;
            }
        },
        template: require('fs').readFileSync(__dirname + '/templates/panelFilter.html', 'utf8'),
    };
}];
