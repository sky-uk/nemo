'use strict';

angular.module('nemo')

    .directive('nemo', ['$compile', function ($compile) {
        return {
            transclude: 'element',
            restrict: 'E',
            scope: {
                model: '='
            },
            link: function (scope, element) {

                var inputElement = angular.element('<div input-' + toSnakeCase(scope.model.type) + ' name="{{model.name}}"></div>');

                if(scope.model.validation && scope.model.validation.length) {
                    scope.model.validation.forEach(function (validation, $index) {
                        inputElement.attr('validation-' + toSnakeCase(validation.type), 'model.validation[' + $index + ']')
                    });
                }

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