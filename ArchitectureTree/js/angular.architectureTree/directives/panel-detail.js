angular.module('ChartsApp').directive('panelDetail', function () {
    return {
        restrict: 'E',
        scope: {
            selectedNode: '='
        },
        link: function (scope) {
            console.log(scope);
        },
        template: `<div class="details panel panel-info">
                    <div class="panel-heading">{{ selectedNode.name }}</div>
                        <div class="panel-body">
                            <div class="url" ng-if="selectedNode.url">
                                <a target="_blank" href="{{ selectedNode.url }}">Open Record</a>
                            </div>
                        
                            <div class="comments panel panel-default" ng-if="selectedNode.comments">
                                <div class="panel-body">{{ selectedNode.comments }}</div>
                            </div>
                            
                            <div class="properties" ng-if="selectedNode.children">
                                <h5>Children</h5>
                                <ul>
                                    <li ng-repeat="child in selectedNode.children">
                                        <a href="{{child.url}}">{{ child.name }}</a>
                                    </li>
                                </ul>
                            </div>
                        
                            <div class="properties" ng-if="selectedNode.details.Dependencies">
                                <h5>Depends on</h5>
                                <ul>
                                    <li ng-repeat="dependency in selectedNode.details.Dependencies">
                                        {{ dependency }}
                                    </li>
                                </ul>
                            </div>
                        
                            <div class="properties" ng-if="selectedNode.details.Dependents">
                                <h5>Dependendents</h5>
                                <ul>
                                    <li ng-repeat="dependent in selectedNode.details.Dependents">
                                        {{ dependent }}
                                    </li>
                                </ul>
                            </div>
                        
                            <div class="properties" ng-if="selectedNode.details.Technos">
                                <h5>Technos</h5>
                                <ul>
                                    <li ng-repeat="techno in selectedNode.details.Technos">
                                        {{ techno }}
                                    </li>
                                </ul>
                            </div>
                        
                            <div class="properties" ng-if="selectedNode.details.Host">
                                <h5>Hosts</h5>
                                <ul>
                                    <li ng-repeat="(hostName, servers) in selectedNode.host">
                                        {{ hostName }}
                                        <ul ng-if="servers">
                                            <li ng-repeat="server in servers">{{ server }}</li>
                                        </ul>
                                        <span ng-if="detail.via">({{ detail.via }})</span>
                                    </li>
                                </ul>
                            </div>
                        
                        </div>
                    </div>`
    };
});
