'use strict';

angular.module('nemo')

    .directive('nemoInput', ['$compile', 'validation', function ($compile, validation) {

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

        function addAttributesToElement(validationList, tElement) {

            var attributeKey, attributeValue, validationOptions;

            if(validationList && validationList.length) {

                validationList.forEach(function (validationListItem, $index) {

                    attributeKey = 'validation-' + toSnakeCase(validationListItem.type);
                    attributeValue = 'model.properties.validation[' + $index + '].rules';
                    tElement.attr(attributeKey, attributeValue);

                    validationOptions = validation.getValidationOptions(validationListItem.type);

                    if (angular.isFunction(validationOptions.preCompileFn)) {
                        validationOptions.preCompileFn(tElement);
                    }
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
                if (scope.model.properties && scope.model.properties.validation) {
                    addAttributesToElement(scope.model.properties.validation, fieldElement);
                }
                replaceTemplate(element, fieldElement);
                compileTemplate(fieldElement, scope);
            }
        }
    }]);