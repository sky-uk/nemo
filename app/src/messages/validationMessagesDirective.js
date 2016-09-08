'use strict';
angular.module('nemo')

    .directive('nemoValidationMessages', ['nemoMessages', function (messages) {
        return {
            scope: {
                validation: '=model'
            },
            template:   '<div data-t-validation-code="{{validationCode}}" data-ng-bind-html="getValidationMessage()" class="validation-messages"></div>',
            link: function(scope) {

                scope.getValidationMessage = function() {
                    for(var validationId in scope.validation.$error) {
                        if(scope.validation.$error.hasOwnProperty(validationId)) {
                            scope.validationCode = validationId;
                            return messages.get(validationId);
                        }
                    }
                };
            }
        }
    }]);
