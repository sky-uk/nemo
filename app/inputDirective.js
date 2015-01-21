'use strict';

angular.module('nemo')

    .directive('input', ['$compile', function ($compile) {
        return {
            transclude: 'element',
            restrict: 'A',
            scope: {
                field: '=input'
            },
            link: function (scope, element) {

                var inputElement = $('<div input-' + toSnakeCase(scope.field.type) + ' name="{{field.name}}"></div>');

                scope.field.validation.forEach(function (validation, $index) {
                    inputElement.attr('validation-' + toSnakeCase(validation.type), 'field.validation[' + $index + ']')
                });

                element.replaceWith(inputElement);
                $compile(inputElement)(scope);

                function toSnakeCase(str) {
                    return str.replace(/([A-Z])/g, function ($1) {
                        return "-" + $1.toLowerCase();
                    });
                }
            }
        }
    }]);