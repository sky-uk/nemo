'use strict';

angular.module('nemo')

    .provider('nemoValidationDirectiveCreator', ['$compileProvider', 'nemoUtilsProvider', function ($compileProvider, utilsProvider) {

        var validationOptionsCache = {};

        function getValidity(validateFn, validationRule, ngModelCtrl, formHandlerCtrl) {
            var isValid = angular.isFunction(validateFn) ?
                validateFn(ngModelCtrl.$viewValue, validationRule.value, formHandlerCtrl, ngModelCtrl) :
                true;
            return isValid;
        }

        function setupValidationRule(validationRule, ngModelCtrl, formHandlerCtrl, validateFn, messages) {
            ngModelCtrl.$validators[validationRule.code] = function () {
                return getValidity(validateFn, validationRule, ngModelCtrl, formHandlerCtrl);
            };
            messages.set(validationRule.code, validationRule.message);
        }

        function registerValidationRule(scope, validateFn, validationRule, ngModelCtrl, formHandlerCtrl, customValidationRuleInterfaceFns) {
            var validationRuleInterfaceFns = getValidationRuleInterfaceFns(validateFn, validationRule, ngModelCtrl, formHandlerCtrl),
                customerValidationRuleInterface = customValidationRuleInterfaceFns ?
                    customValidationRuleInterfaceFns(scope, ngModelCtrl) :
                    {};
            angular.extend(validationRuleInterfaceFns, customerValidationRuleInterface);
            formHandlerCtrl.registerValidationRule(validationRule.code, validationRuleInterfaceFns);
        }

        function getValidationRuleInterfaceFns(validateFn, validationRule, ngModelCtrl, formHandlerCtrl) {
            return {
                forceInvalid: function () {
                    validityChange(ngModelCtrl, validationRule.code, false);
                },
                refreshValidity: function () {
                    refreshValidity(validateFn, validationRule, ngModelCtrl, formHandlerCtrl);
                }
            };
        }

        function validityChange(ngModelCtrl, validationRuleCode, newValidity) {
            ngModelCtrl.$setTouched();
            ngModelCtrl.$setValidity(validationRuleCode, newValidity);
        }

        function refreshValidity(validateFn, validationRule, ngModelCtrl, formHandlerCtrl) {
            var isValid = getValidity(validateFn, validationRule, ngModelCtrl, formHandlerCtrl);
            ngModelCtrl.$setValidity(validationRule.code, isValid);
            ngModelCtrl.$setDirty();
            ngModelCtrl.$setTouched();
        }

        function getLinkFn(options, directiveName, validateFn, messages) {
            return function (scope, element, attrs, controllers) {
                var validationRules = scope.$eval(attrs[directiveName]),
                    ngModelCtrl = controllers[0],
                    formHandlerCtrl = controllers[1];
                validationRules.forEach(function (validationRule) {
                    setupValidationRule(validationRule, ngModelCtrl, formHandlerCtrl, validateFn, messages);
                    registerValidationRule(scope, validateFn, validationRule, ngModelCtrl, formHandlerCtrl, options.validationRuleInterfaceFns);
                });
            };
        }

        function getDirectiveDefinitionObject(options, directiveName, validateFn, messages) {
            return {
                require: ['ngModel', '^nemoFormHandler'],
                restrict: 'A',
                link: getLinkFn(options, directiveName, validateFn, messages)
            };
        }

        function validation(type, options) {

            storeValidationOptionsInCache(type, options);

            var directiveName = 'validation' + utilsProvider.capitalise(type);
            $compileProvider.directive
                .apply(null, [directiveName, ['nemoMessages', function (messages) {
                    return getDirectiveDefinitionObject(options, directiveName, options.validateFn, messages);
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
