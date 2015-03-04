'use strict';

angular.module('nemo')

    .provider('nemoValidationDirectiveCreator', ['$compileProvider', 'nemoUtilsProvider', function ($compileProvider, utilsProvider) {

        var validationOptionsCache = {};

        function setupValidationRule(validationRule, ngModelController, formHandlerController, validateFn, messages) {
            ngModelController.$validators[validationRule.code] = function (viewValue, modelValue) {
                var isValid = angular.isFunction(validateFn) ?
                    validateFn(modelValue, validationRule.value, formHandlerController, ngModelController) :
                    true;
                return isValid;
            };
            messages.set(validationRule.code, validationRule.message);
        }

        function getLinkFn(directiveName, validateFn, messages) {
            return function (scope, element, attrs, controllers) {
                var validationRules = scope.$eval(attrs[directiveName]),
                    ngModelController = controllers[0],
                    formHandlerController = controllers[1];
                validationRules.forEach(function (validationRule) {
                    setupValidationRule(validationRule, ngModelController, formHandlerController, validateFn, messages);
                });
            }
        }

        function getDirectiveDefinitionObject(directiveName, validateFn, messages) {
            return {
                require: ['ngModel', '^nemoFormHandler'],
                restrict: 'A',
                link: getLinkFn(directiveName, validateFn, messages)
            };
        }

        function validation(type, options) {

            storeValidationOptionsInCache(type, options);

            var directiveName = 'validation' + utilsProvider.capitalise(type);
            $compileProvider.directive
                .apply(null, [directiveName, ['nemoMessages', function (messages) {
                    return getDirectiveDefinitionObject(directiveName, options.validateFn, messages);
                }]]);

            return this;
        }

        function storeValidationOptionsInCache(type, options) {
            validationOptionsCache[type] = options;
        }

        function getValidationOptionsFromCache(type) {
            return validationOptionsCache[type];
        }

        return {
            validation: validation,
            $get: function () {
                return {
                    getValidationOptions: getValidationOptionsFromCache
                }
            }
        }
    }]);
