module.exports = ['CONST', 'bus', 'data', function (CONST, bus, data) {
    'use strict';

    return {
        restrict: 'E',
        replace: true,
        template: require('fs').readFileSync(__dirname + '/templates/treeChart.html', 'utf8'),
        scope: {
            data: '='
        },
        link: function (scope, element) {
            var chart = d3.chart.architectureTree();

            scope.$watch("data", function (data) {
                if (typeof (data) === 'undefined') {
                    return;
                }
                console.log('data!');
                console.log(data);

                chart.diameter(960)
                    .data(scope.data);

                d3.select(element[0])
                    .call(chart);
            });

            bus.on(CONST.EVENTS.FILTER_CHANGE, function (nameFilter) {
                var d = {
                    text: data.filter.getNameFilter(),
                    technos: data.filter.getTechnosFilter(),
                    hosts: data.filter.getHostsFilter()
                };
                chart.filter(d);
            });

            bus.on(CONST.EVENTS.SELECT_NODE, function (name) {
                chart.select(name);
            });

            bus.on(CONST.EVENTS.UNSELECT_NODE, function () {
                chart.unselect();
            });
        }
    };
}];
