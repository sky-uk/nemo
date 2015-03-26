'use strict';

angular.module('nemo')

    .directive('nemoInput', ['$compile', 'nemoValidationDirectiveCreator', function ($compile, validation) {

        function toSnakeCase(str) {
            return str.replace(/([A-Z])/g, function ($1) {
                return "-" + $1.toLowerCase();
            });
        }

        function creatElement() {
            return angular.element('<div></div>');
        }

        function addInputAttributeToElement(type, tElement) {
            tElement[0].setAttribute('input-' + toSnakeCase(type), '');
        }

        function addValidationAttributeToElement(validationListItem, tElement, validationIndex) {
            var attributeKey = 'validation-' + toSnakeCase(validationListItem.type),
                attributeValue = 'model.properties.validation[' + validationIndex + '].rules';
            tElement[0].setAttribute(attributeKey, attributeValue);
        }

        function preCompileValidationRuleFn(validationListItem, tElement) {
            var validationOptions = validation.getValidationOptions(validationListItem.type);
            if (angular.isFunction(validationOptions.preCompileFn)) {
                validationOptions.preCompileFn(tElement);
            }
        }

        function setAutoFocus(tElement, hasFocus) {
            if (hasFocus) {
                tElement[0].setAttribute('autofocus', 'true');
            }
        }

        function replaceTemplate(oldTempate, newTemplate) {
            oldTempate.replaceWith(newTemplate);
        }

        function compileTemplate(template, scope) {
            $compile(template)(scope);
        }

        function manageValidationRules(fieldProperties, tElement) {
            var validationList = fieldProperties && fieldProperties.validation;
            if (validationList && validationList.length) {
                validationList.forEach(function (validationListItem, validationIndex) {
                    addValidationAttributeToElement(validationListItem, tElement, validationIndex);
                    preCompileValidationRuleFn(validationListItem, tElement);
                });
            }
        }

        function getLinkFn() {
            return function (scope, element) {
                var fieldElement = creatElement();
                addInputAttributeToElement(scope.model.type, fieldElement);
                setAutoFocus(fieldElement, scope.hasFocus);
                manageValidationRules(scope.model.properties, fieldElement);
                replaceTemplate(element, fieldElement);
                compileTemplate(fieldElement, scope);
            }
        }

        return {
            transclude: 'element',
            restrict: 'E',
            scope: {
                model: '=',
                hasFocus: '='
            },
            link: getLinkFn()
        }
    }]);