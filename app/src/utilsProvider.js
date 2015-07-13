angular.module('nemo')

    .provider('nemoUtils', ['nemoMessagesProvider', function (messagesProvider) {

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

        function forceServerInvalid(errorMessage, errorIndex, scope, ngModelCtrl) {
            var validationId = scope.model.name + errorIndex;
            messagesProvider.set(validationId, errorMessage);
            ngModelCtrl.$setValidity(validationId, false);
            setValidOnChange(scope, ngModelCtrl, validationId);
        }

        function setValidOnChange(scope, ngModelCtrl, validationId) {
            var unregisterFn = scope.$watch(function () {
                return ngModelCtrl.$viewValue;
            }, function (newValue, oldValue) {
                //noinspection JSValidateTypes
                if (newValue !== oldValue) {
                    ngModelCtrl.$setValidity(validationId, true);
                    unregisterFn();
                }
            });
        }

        return {
            capitalise: capitalise,
            contains: contains,
            debounce: debounce,
            forceServerInvalid: forceServerInvalid,
            $get: function () {
                return {
                    capitalise: capitalise,
                    contains: contains,
                    debounce: debounce
                };
            }
        };
    }]);