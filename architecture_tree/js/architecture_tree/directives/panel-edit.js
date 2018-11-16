module.exports = function () {
    return {
        restrict: 'E',
        template: require('fs').readFileSync(__dirname + '/templates/panelEdit.html', 'utf8'),
    };
};
