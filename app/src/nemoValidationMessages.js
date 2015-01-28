'use strict';
angular.module('nemo')

    .directive('nemoValidationMessages', ['messages', function (messages) {

        return {
            scope: {
                model: '='
            },
            template:   '<div data-ng-repeat="(key, value) in model.$error" data-ng-if="model.$dirty && $index < 1">' +
                            '{{getValidationMessage(key)}}' +
                        '</div>',
            link: function(scope) {

                scope.getValidationMessage = function(validationCode) {
                    return messages.get(validationCode);
                };
            }
        }
    }]);