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
            element[0].setAttribute('input-' + toSnakeCase(type), '');
        }

        function addValidationAttributesToElement(validationList, element) {
            if(validationList && validationList.length) {
                validationList.forEach(function (validation, $index) {
                    var attributeKey = 'validation-' + toSnakeCase(validation.type),
                        attributeValue = 'model.validation[' + $index + '].rules';
                    element[0].setAttribute(attributeKey, attributeValue);
                });
            }
        }

        function replaceTemplate(oldTempate, newTemplate) {
            oldTempate.replaceWith(newTemplate);
        }

        function compileTemplate(template, scope) {
            $compile(template)(scope);
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
                replaceTemplate(element, fieldElement);
                compileTemplate(fieldElement, scope);
            }
        }
    }]);