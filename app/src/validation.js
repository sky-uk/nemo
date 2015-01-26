'use strict';

angular.module('nemo')

    .provider('validation', ['$compileProvider', function ($compileProvider) {

        function capitaliseFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function setupValidationRule(validationRule, ngModelController, formHandlerController, validateFn) {
            ngModelController.$validators[validationRule.code] = function (viewValue) {
                var isValid = (validateFn) ?
                    validateFn(viewValue, validationRule.value, formHandlerController) :
                    true;
                validationRule.show = (isValid) ? false : ngModelController.$dirty;
                return isValid;
            };
        }

        function getLinkFn(directiveName, validateFn) {
            return function (scope, element, attrs, controllers) {
                var validationRules = scope.$eval(attrs[directiveName]),
                    ngModelController = controllers[0],
                    formHandlerController = controllers[1];
                validationRules.forEach(function (validationRule) {
                    setupValidationRule(validationRule, ngModelController, formHandlerController, validateFn);
                });
            }
        }

        function getDDO(directiveName, validateFn) {
            return {
                require: ['ngModel', '^formHandler'],
                restrict: 'A',
                link: getLinkFn(directiveName, validateFn)
            };
        }

        function validation(type, options) {
            var directiveName = 'validation' + capitaliseFirstLetter(type);
            $compileProvider.directive
                .apply(null, [directiveName, [function () {
                    return getDDO(directiveName, options.validateFn);
                }]]);
            return this;
        }

        return {
            validation: validation,
            $get: angular.noop
        }
    }]);
