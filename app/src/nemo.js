'use strict';

angular.module('nemo')

    .directive('nemo', ['$compile', function ($compile) {

        function toSnakeCase(str) {
            return str.replace(/([A-Z])/g, function ($1) {
                return "-" + $1.toLowerCase();
            });
        }

        function creatElement() {
            return angular.element('<div></div>');
        }

        function addInputAttributeToElement(type, element) {
            element.attr('input-' + toSnakeCase(type), '');
        }

        function addValidationAttributesToElement(validationList, element) {
            if(validationList && validationList.length) {
                validationList.forEach(function (validation, $index) {
                    element.attr('validation-' + toSnakeCase(validation.type), 'model.validation[' + $index + ']')
                });
            }
        }

        return {
            transclude: 'element',
            restrict: 'E',
            scope: {
                model: '='
            },
            link: function (scope, element) {
                var fieldElement = creatElement();
                addInputAttributeToElement(scope.model.type, fieldElement);
                addValidationAttributesToElement(scope.model.validation, fieldElement);
                element.replaceWith(fieldElement);
                $compile(fieldElement)(scope);
            }
        }
    }]);