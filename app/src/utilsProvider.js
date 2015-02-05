'use strict';
angular.module('nemo')

    .provider('utils', [function () {

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

        return {
            capitalise: capitalise,
            contains: contains,
            $get: angular.noop
        }
    }]);