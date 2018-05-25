module.exports = function (CONST, bus, data) {
    return {
        restrict: 'E',
        link: function link(scope, element, attrs) {

            bus.on(CONST.EVENTS.DATA_UPDATE, function (data) {
                scope.controls = computeControls(data);
            });

            scope.nameFilter = '';
            let controlsFilter = {};

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
                let controls = {};

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
        template: `<div class="filters panel panel-default">
    <div class="panel-heading">Search</div>
    <div class="panel-body">
        <form id="filter_form">
            <input name="name" type="text" class="form-control" placeholder="Filter by name"
                   ng-model="nameFilter"/>
            <div id="controls">
                <h5>Controls</h5>
                <a ng-repeat="control in controls" class="btn btn-default btn-xs" ng-click="toggleControlsFilter(control)"
                   ng-class="{'btn-primary': isControlInFilter(control) }">{{ control.number }}</a>
            </div>
        </form>
    </div>
    </div>`
    };
};
