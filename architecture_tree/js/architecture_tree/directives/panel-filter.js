module.exports = function (CONST, bus, data) {
    return {
        restrict: 'E',
        link: function link(scope, element, attrs) {

            bus.on(CONST.EVENTS.DATA_UPDATE, function (data) {
                scope.technos = computeTechnos(data);
                scope.hosts = computeHosts(data);
            });

            scope.nameFilter = '';

            let technosFilter = [];
            let hostsFilter = [];

            scope.$watch('nameFilter', function (name) {
                data.filter.setNameFilter(name);
            });

            scope.toggleTechnoFilter = function (techno) {
                if (scope.isTechnoInFilter(techno)) {
                    technosFilter.splice(technosFilter.indexOf(techno), 1);
                } else {
                    technosFilter.push(techno);
                }
                bus.emit(CONST.EVENTS.FILTER_CHANGE, technosFilter);
            };

            scope.isTechnoInFilter = function (techno) {
                return technosFilter.indexOf(techno) !== -1;
            };

            scope.toggleHostFilter = function (host) {
                if (scope.isHostInFilter(host)) {
                    hostsFilter.splice(hostsFilter.indexOf(host), 1);
                } else {
                    hostsFilter.push(host);
                }
                bus.emit(CONST.EVENTS.FILTER_CHANGE, hostsFilter);
            };

            scope.isHostInFilter = function (host) {
                return hostsFilter.indexOf(host) !== -1;
            };

            function computeTechnos(rootNode) {
                var technos = [];

                function addNodeTechnos(node) {
                    if (node.technos) {
                        node.technos.forEach(function (techno) {
                            technos[techno] = true;
                        });
                    }
                    if (node.children) {
                        node.children.forEach(function (childNode) {
                            addNodeTechnos(childNode);
                        });
                    }
                }

                addNodeTechnos(rootNode);

                return Object.keys(technos).sort();
            }

            function computeHosts(rootNode) {
                var hosts = {};

                function addNodeHosts(node) {
                    if (node.host) {
                        for (var i in node.host) {
                            hosts[i] = true;
                        }
                    }
                    if (node.children) {
                        node.children.forEach(function (childNode) {
                            addNodeHosts(childNode);
                        });
                    }
                }

                addNodeHosts(rootNode);

                return Object.keys(hosts).sort();
            }
        },
        template: `<div class="filters panel panel-default">
    <div class="panel-heading">Search</div>
    <div class="panel-body">
        <form id="filter_form">
            <input name="name" type="text" class="form-control" placeholder="Filter by name"
                   ng-model="nameFilter"/>
            <div id="technos">
                <h5>Technos</h5>
                <a ng-repeat="techno in technos" class="btn btn-default btn-xs" ng-click="toggleTechnoFilter(techno)"
                   ng-class="{'btn-primary': isTechnoInFilter(techno) }">{{ techno }}</a>
            </div>
            <div id="host">
                <h5>Host</h5>
                <a ng-repeat="host in hosts" class="btn btn-default btn-xs" ng-click="toggleHostFilter(host)"
                   ng-class="{'btn-primary': isHostInFilter(host) }">{{ host }}</a>
            </div>
        </form>
    </div>
    </div>`
    };
};
