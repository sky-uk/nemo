'use strict';
angular.module('nemo')

    .directive('nemoValidationMessages', ['messages', function (messages) {

        return {
            scope: {
                model: '='
            },
            template:   '<div data-ng-if="model.$dirty && model.$invalid" data-t-validation-code="{{validationCode}}">' +
                            '{{getValidationMessage()}}' +
                        '</div>',
            link: function(scope) {

                scope.getValidationMessage = function() {
                    for(var validationCode in scope.model.$error) {
                        if(scope.model.$error.hasOwnProperty(validationCode)) {
                            scope.validationCode = validationCode;
                            return messages.get(validationCode);
                        }
                    }
                };
            }
        }
    }]);