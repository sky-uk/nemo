'use strict';
angular.module('nemo')

    .directive('nemoValidationMessages', ['nemoMessages', function (messages) {
        return {
            scope: {
                model: '='
            },
            template:   '<div data-ng-if="(model.$dirty || model.$touched) && model.$invalid" data-t-validation-code="{{validationCode}}" class="field-error">' +
                            '{{getValidationMessage()}}' +
                        '</div>',
            link: function(scope) {

                scope.getValidationMessage = function() {
                    for(var validationId in scope.model.$error) {
                        if(scope.model.$error.hasOwnProperty(validationId)) {
                            scope.validationCode = validationId;
                            return messages.get(validationId);
                        }
                    }
                };
            }
        }
    }]);