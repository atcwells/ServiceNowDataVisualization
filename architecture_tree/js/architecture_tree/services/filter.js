module.exports = filter = function (bus, CONST) {
    'use strict';

    let _filters = {
        nameFilter: '',
        technosFilter: [],
        hostsFilter: []
    };

    let setFilter = function (key, newFilterValue) {
        _filters[key] = newFilterValue;
        bus.emit(CONST.EVENTS.FILTER_CHANGE);
    };

    let getFilter = function (filterName) {
        return _filters[filterName];
    };

    let getNameFilter = function () {
        return getFilter('nameFilter');
    };

    let setNameFilter = function (newFilter) {
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
};
