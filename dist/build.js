angular.module('nemo', [])

    .config(['inputProvider', 'validationProvider', function (inputProvider, validationProvider) {

        inputProvider

            .input('text', {
                template: '<input type="text" />'
            })

            .input('select', {
                template: '<select data-ng-options="option.value as option.text for option in model.options"></select>'
            })

            .input('hidden', {
                template: '<input type="hidden" />'
            })

            .input('password', {
                template: '<input type="password" />'
            })

            .input('email', {
                template: '<input type="email" />'
            })

            .input('checkbox', {
                template: '<input type="checkbox" />'
            });

        validationProvider

            .validation('required', {
                validateFn: function (value, validationRule) {
                    return (validationRule) ?
                        value != '' &&  !_.isEmpty(value) && !_.isNull(value) && !_.isUndefined(value)  :
                        true;
                }
            })

            .validation('inlist', {
                validateFn: function (value, validationRule) {
                    return _.find(validationRule, function(validValue) {
                        return value === validValue;
                    });
                }
            })

            .validation('pattern', {
                validateFn: function (value, validationRule) {
                    var regex = new RegExp(validationRule);
                    return value && validationRule && regex.test(value);
                }
            })

//            .validation('notpattern', {
//                validateFn: function (value, validationRule) {
//                    var regex = new RegExp(validationRule);
//                    return value && validationRule && !regex.test(value);
//                }
//            })

            .validation('mustnotcontain', {
                validateFn: function (value, validationRule, formHandlerController) {
                    var targetValue = formHandlerController.getFieldValue(validationRule);
                    return (value && targetValue) ? value.indexOf(targetValue) < 0 : true;
                }
            })

            .validation('mustmatch', {
                validateFn: function (value, validationRule, formHandlerController) {
                    var targetValue = formHandlerController.getFieldValue(validationRule);
                    return (value) ? value === targetValue : true;
                }
            })

            .validation('minlength', {
                validateFn: function (value, validationRule) {
                    return (value && validationRule) ? value.length >= validationRule : true;
                }
            })

            .validation('maxlength', {
                validateFn: function (value, validationRule) {
                    return (value && validationRule) ? value.length <= validationRule : true;
                }
            })

            .validation('email', {
                validateFn: function (value, validationRule) {
                    var regex = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
                    return value && validationRule && regex.test(value);
                }
            })

            .validation('mustbetrue', {
                validateFn: function (value, validationRule) {
                    return value === validationRule;
                }
            });
    }]);
'use strict';

angular.module('nemo')

    .directive('formHandler', ['$timeout', function ($timeout) {
        return {
            controller: ['$scope', '$attrs', function ($scope, $attrs) {

                var self = this;

                this.getFieldValue = function(fieldName) {
                    return $scope[$attrs.name][fieldName].$viewValue;
                };

                this.forceValidity = function (fieldName, validationRuleCode, newValidity) {
                    $scope[$attrs.name][fieldName].$setValidity(validationRuleCode, newValidity);
                };

                this.getLink = function(rel) {
                    return _.find($scope.links, function (value) {
                        return _.contains(value.rel, rel);
                    }).href;
                };

                $scope.$evalAsync(function () {
                    $scope[$attrs.name].forceValidity = self.forceValidity;
                });
            }]
        }
    }]);
'use strict';

angular.module('nemo')

    .provider('input', ['$compileProvider', function ($compileProvider) {

        function capitaliseFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function getTemplateWithAttributes(template) {
            var parentTemplateElement, templateElement;
            parentTemplateElement = document.createElement('div');
            parentTemplateElement.innerHTML = template;
            templateElement = parentTemplateElement.firstChild;
            templateElement.setAttribute('ng-model', 'model.value');
            templateElement.setAttribute('name', '{{model.name}}');
            return parentTemplateElement.innerHTML;
        }

        function getLinkFn(options, $compile, $http) {
            return function (scope, element, attrs, controllers) {
                var formHandlerController = controllers[2];
                if (options.linkFn) {
                    options.linkFn(scope, element, attrs, formHandlerController, $compile, $http);
                }
            }
        }

        function getDDO(options, $compile, $http) {
            return {
                require: ['ngModel', '^form', '^formHandler'],
                template: getTemplateWithAttributes(options.template),
                replace: true,
                restrict: 'A',
                link: getLinkFn(options, $compile, $http)
            }
        }

        function input(type, options) {
            $compileProvider.directive
                .apply(null, [
                    'input' + capitaliseFirstLetter(type),
                    ['$compile', '$http', function ($compile, $http) {
                        return getDDO(options, $compile, $http);
                }]]);
            return this;
        }

        return {
            input: input,
            $get: angular.noop
        }
    }]);
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
                    element[0].setAttribute('validation-' + toSnakeCase(validation.type), 'model.validation[' + $index + '].rules')
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
