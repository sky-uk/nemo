angular.module('nemo')

    .provider('nemoUtils', [function () {

        'use strict';

        function capitalise(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function contains(list, item) {
            var isFound = false;
            if(list && list.length) {
                angular.forEach(list, function (listItem) {
                    isFound = isFound || (item === listItem);
                });
            }
            return isFound;
        }

        // Extracted from Underscore.js 1.5.2
        function debounce(func, wait, immediate) {
            var timeout, args, context, timestamp, result;
            return function() {
                context = this;
                args = arguments;
                timestamp = new Date();
                var later = function() {
                    var last = (new Date()) - timestamp;
                    if (last < wait) {
                        timeout = setTimeout(later, wait - last);
                    } else {
                        timeout = null;
                        if (!immediate) {
                            result = func.apply(context, args);
                        }
                    }
                };
                var callNow = immediate && !timeout;
                if (!timeout) {
                    timeout = setTimeout(later, wait);
                }
                if (callNow) {
                    result = func.apply(context, args);
                }
                return result;
            };
        }

        return {
            capitalise: capitalise,
            contains: contains,
            debounce: debounce,
            $get: function () {
                return {
                    capitalise: capitalise,
                    contains: contains,
                    debounce: debounce
                };
            }
        };
    }]);