module.exports = function ($http, $q) {
    'use strict';

    // Simple message bus to event the overhead of angular emit / broadcast

    let subscribers = {};

    let on = function (eventName, callback) {
        if (!subscribers[eventName]) {
            subscribers[eventName] = [];
        }
        subscribers[eventName].push(callback);
    };

    let emit = function (eventName, body) {
        if (!subscribers[eventName]) {
            return false;
        }
        subscribers[eventName].forEach(function (callback) {
            callback(body);
        });
        return true;
    };

    return {
        on: on,
        emit: emit
    };
};
