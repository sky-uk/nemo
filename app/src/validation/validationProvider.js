'use strict';

angular.module('nemo')

    .provider('nemoValidationDirectiveCreator', ['$compileProvider', 'nemoUtilsProvider', function ($compileProvider, utilsProvider) {

        var validationOptionsCache = {}, validationRuleType = {};

        function getValidity(validateFn, validationRule, ngModelCtrl, formHandlerCtrl, validFns) {
            var isValid;
            if(ngModelCtrl.forcedValidityValue !== undefined) {
                isValid = ngModelCtrl.forcedValidityValue;
            } else if(angular.isFunction(validateFn)) {
                isValid = validateFn(ngModelCtrl.$viewValue, validationRule, formHandlerCtrl, validFns);
            } else {
                isValid = !ngModelCtrl.$error[validationRule.id];
            }
            return isValid;
        }

        function setupValidationRule(type, validationRule, ngModelCtrl, formHandlerCtrl, validateFn, validFns, messages) {
            validationRuleType[validationRule.id] = type;
            ngModelCtrl.$validators[validationRule.id] = function () {
                return getValidity(validateFn, validationRule, ngModelCtrl, formHandlerCtrl, validFns);
            };
            messages.set(validationRule.id, validationRule.message);
        }

        function registerValidationRule(validationRule, formHandlerCtrl, validationRuleInterfaceFns) {
            formHandlerCtrl.registerValidationRule(validationRule.id, validationRuleInterfaceFns);
        }

        function getValidationRuleInterfaceFnsObject(scope, validateFn, validationRule, ngModelCtrl, formHandlerCtrl, options) {
            var validationRuleInterfaceFns = getValidationRuleInterfaceFns(validateFn, validationRule, ngModelCtrl, formHandlerCtrl),
                customerValidationRuleInterface = options.validationRuleInterfaceFns ?
                    options.validationRuleInterfaceFns(scope, ngModelCtrl) :
                {};
            angular.extend(validationRuleInterfaceFns, customerValidationRuleInterface);
            return validationRuleInterfaceFns;
        }

        function getValidationRuleInterfaceFns(validateFn, validationRule, ngModelCtrl, formHandlerCtrl) {
            return {
                forceInvalid: function () {
                    validityChange(ngModelCtrl, validationRule.id, false);
                },
                forceValid: function () {
                    validityChange(ngModelCtrl, validationRule.id, true);
                },
                refreshValidity: function () {
                    var validFns = getValidationRuleInterfaceFns(validateFn, validationRule, ngModelCtrl, formHandlerCtrl);
                    refreshValidity(validateFn, validationRule, ngModelCtrl, formHandlerCtrl, validFns);
                },
                getType: function (validationRuleId) {
                    return validationRuleType[validationRuleId];
                },
                getValue: function () {
                    return ngModelCtrl.$viewValue;
                },
                isEmpty: function (value) {
                    return ngModelCtrl.$isEmpty(value);
                },
                isActive: function () {
                    return ngModelCtrl.isActive;
                },
                setDirty: function () {
                    return ngModelCtrl.$setDirty();
                },
                setTouched: function () {
                    return ngModelCtrl.$setTouched();
                }
            };
        }

        function validityChange(ngModelCtrl, validationRuleCode, newValidity) {
            ngModelCtrl.$setValidity(validationRuleCode, newValidity);
            ngModelCtrl.forcedValidityValue = newValidity;
        }

        function refreshValidity(validateFn, validationRule, ngModelCtrl, formHandlerCtrl, validFns) {
            var isValid = getValidity(validateFn, validationRule, ngModelCtrl, formHandlerCtrl, validFns);
            ngModelCtrl.$setValidity(validationRule.id, isValid);
        }

        function getLinkFn(type, options, directiveName, validateFn, messages) {
            return function (scope, element, attrs, controllers) {
                var validationRules = scope.$eval(attrs[directiveName]),
                    ngModelCtrl = controllers[0],
                    formHandlerCtrl = controllers[1];

                validationRules.forEach(function (validationRule) {
                    var validFns = getValidationRuleInterfaceFnsObject(scope, validateFn, validationRule, ngModelCtrl, formHandlerCtrl, options);

                    setupValidationRule(type, validationRule, ngModelCtrl, formHandlerCtrl, validateFn, validFns, messages);
                    registerValidationRule(validationRule, formHandlerCtrl, validFns);

                    if (options.linkFn) {
                        options.linkFn(scope, element, attrs, formHandlerCtrl, validFns);
                    }
                });
            };
        }

        function getDirectiveDefinitionObject(type, options, directiveName, validateFn, messages) {
            return {
                require: ['ngModel', '^nemoFormHandler'],
                restrict: 'A',
                link: getLinkFn(type, options, directiveName, validateFn, messages)
            };
        }

        function validation(type, options) {

            storeValidationOptionsInCache(type, options);

            var directiveName = 'validation' + utilsProvider.capitalise(type);
            $compileProvider.directive
                .apply(null, [directiveName, ['nemoMessages', function (messages) {
                    return getDirectiveDefinitionObject(type, options, directiveName, options.validateFn, messages);
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
                };
            }
        };
    }]);
