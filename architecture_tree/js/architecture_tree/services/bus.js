module.exports = ['$http', '$q', function ($http, $q) {
    'use strict';

    // Simple message bus to event the overhead of angular emit / broadcast

    var subscribers = {};

    var on = function (eventName, callback) {
        if (!subscribers[eventName]) {
            subscribers[eventName] = [];
        }
        console.log(eventName + ': subscribed');
        subscribers[eventName].push(callback);
    };

    var emit = function (eventName, body) {
        if (!subscribers[eventName]) {
            return false;
        }
        subscribers[eventName].forEach(function (callback) {
            console.log(eventName + ': running...');
            callback(body);
        });
        return true;
    };

    return {
        on: on,
        emit: emit
    };
}];
