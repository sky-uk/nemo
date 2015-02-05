'use strict';
angular.module('nemo')

    .directive('nemoValidationMessages', ['messages', function (messages) {

        return {
            scope: {
                model: '='
            },
            template: '<div data-ng-if="model.$dirty && model.$invalid">{{getValidationMessage()}}</div>',
            link: function(scope) {

                scope.getValidationMessage = function() {
                    for(var validationCode in scope.model.$error) {
                        if(scope.model.$error.hasOwnProperty(validationCode)) {
                            return messages.get(validationCode);
                        }
                    }
                };
            }
        }
    }]);