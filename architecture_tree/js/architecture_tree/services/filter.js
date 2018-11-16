module.exports = ['bus', 'CONST', function (bus, CONST) {
    'use strict';

    var _filters = {
        nameFilter: '',
        technosFilter: [],
        hostsFilter: []
    };

    var setFilter = function (key, newFilterValue) {
        _filters[key] = newFilterValue;
        bus.emit(CONST.EVENTS.FILTER_CHANGE);
    };

    var getFilter = function (filterName) {
        return _filters[filterName];
    };

    var getNameFilter = function () {
        return getFilter('nameFilter');
    };

    var setNameFilter = function (newFilter) {
        return setFilter('nameFilter', newFilter);
    };

    return {
        getNameFilter: getNameFilter,
        setNameFilter: setNameFilter,
        getTechnosFilter: getNameFilter,
        setTechnosFilter: setNameFilter,
        getHostsFilter: getNameFilter,
        setHostsFilter: setNameFilter
    }
}];
