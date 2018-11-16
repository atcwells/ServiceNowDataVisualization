module.exports = function () {
    return {
        restrict: 'E',
        scope: {
            selectedNode: '='
        },
        link: function (scope) {
        },
        template: require('fs').readFileSync(__dirname + '/templates/panelDetail.html', 'utf8'),
    };
};
