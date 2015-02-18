angular.module('nemo', [])

    .config(['inputProvider', 'validationProvider', 'utilsProvider', 'captchaProvider', function (inputProvider, validationProvider, utilsProvider, captchaProvider) {

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
                template: '<input type="text" />'
            })

            .input('checkbox', {
                template: '<input type="checkbox" />'
            })

            .input('captcha', captchaProvider);

        validationProvider

            .validation('required', {
                validateFn: function (value, validationRuleValue, formHandlerController, ngModelController) {
                    return (validationRuleValue) ? !ngModelController.$isEmpty(value) : true;
                }
            })

            .validation('inlist', {
                validateFn: function (value, validationRuleValue) {
                    return (value) ? utilsProvider.contains(validationRuleValue, value) : true;
                }
            })

            .validation('pattern', {
                validateFn: function (value, validationRuleValue) {
                    return (value) ? new RegExp(validationRuleValue).test(value) : true;
                }
            })

            .validation('notpattern', {
                validateFn: function (value, validationRuleValue) {
                    return (value) ? !(new RegExp(validationRuleValue).test(value)) : true;
                }
            })

            .validation('mustnotcontain', {
                validateFn: function (value, validationRuleValue, formHandlerController) {
                    var targetValue = formHandlerController.getFieldValue(validationRuleValue);
                    return (value && targetValue) ? value.indexOf(targetValue) < 0 : true;
                }
            })

            .validation('mustmatch', {
                validateFn: function (value, validationRuleValue, formHandlerController) {
                    var targetValue = formHandlerController.getFieldValue(validationRuleValue);
                    return (value) ? value === targetValue : true;
                }
            })

            .validation('minlength', {
                validateFn: function (value, validationRuleValue) {
                    return (value && validationRuleValue) ? value.length >= validationRuleValue : true;
                }
            })

            .validation('maxlength', {
                validateFn: function (value, validationRuleValue) {
                    return (value && validationRuleValue) ? value.length <= validationRuleValue : true;
                }
            })

            .validation('email', {
                validateFn: function (value, validationRuleValue) {
                    if (value && validationRuleValue) {
                        return new RegExp(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i).test(value);
                    }
                    return true;
                }
            })

            .validation('mustbeequal', {
                validateFn: function (value, validationRuleValue) {
                    return (value || value === false) ? value === validationRuleValue : true;
                }
            });
    }]);
'use strict';
angular.module('nemo')

    .provider('utils', [function () {

        function capitalise(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function contains(list, item) {
            var isFound = false;
            if(list && list.length) {
                angular.forEach(list, function (listItem) {
                    isFound = isFound || (item === listItem);
                });
            }
            return isFound;
        }

        return {
            capitalise: capitalise,
            contains: contains,
            $get: angular.noop
        }
    }]);
angular.module('nemo').provider('captcha', [function () {
    return {
        template: '<div>' +
            '<img ng-src="{{captchaModel.getImageUri()}}">' +
            '<input type="text" ng-model="model.value">' +
            '<a ng-click="requestAnother()">{{getRequestCaptchaCopy()}}</a>' +
            '<audio controls ng-if="captchaModel"><source ng-src="{{captchaModel.getAudioUri()}}"></audio>' +
        '</div>',
        linkFn: function (scope, element, attrs, controllers) {
            var ngModelController = controllers[0],
                formHandler = controllers[1],
                watcherUnbind = scope.$watch('model.value', function (newVal, oldVal) {
                    if(newVal !== oldVal) {
                        ngModelController.$setDirty();
                        watcherUnbind();
                    }
                });

            scope.updateCaptchaId = function(value) {
                formHandler.setFieldValue('captchaId', value);
            }
        },
        controller: 'CaptchaCtrl',
        $get: {}
    }
}]);
'use strict';

angular.module('nemo')

    .provider('input', ['$compileProvider', 'utilsProvider', function ($compileProvider, utilsProvider) {

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
                if (options.linkFn) {
                    options.linkFn(scope, element, attrs, controllers, $compile, $http);
                }
            }
        }

        function getDirectiveDefinitionObject(options, $compile, $http) {
            return {
                require: ['ngModel', '^formHandler'],
                template: getTemplateWithAttributes(options.template),
                replace: true,
                restrict: 'A',
                link: getLinkFn(options, $compile, $http),
                controller: options.controller
            }
        }

        function input(type, options) {
            $compileProvider.directive
                .apply(null, [
                    'input' + utilsProvider.capitalise(type),
                    ['$compile', '$http', function ($compile, $http) {
                        return getDirectiveDefinitionObject(options, $compile, $http);
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

    .provider('validation', ['$compileProvider', 'utilsProvider', function ($compileProvider, utilsProvider) {

        function setupValidationRule(validationRule, ngModelController, formHandlerController, validateFn, messages) {
            ngModelController.$validators[validationRule.code] = function (viewValue, modelValue) {
                var isValid = (validateFn) ?
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
                require: ['ngModel', '^formHandler'],
                restrict: 'A',
                link: getLinkFn(directiveName, validateFn, messages)
            };
        }

        function validation(type, options) {
            var directiveName = 'validation' + utilsProvider.capitalise(type);
            $compileProvider.directive
                .apply(null, [directiveName, ['messages', function (messages) {
                    return getDirectiveDefinitionObject(directiveName, options.validateFn, messages);
                }]]);
            return this;
        }

        return {
            validation: validation,
            $get: angular.noop
        }
    }]);

angular.module('nemo').service('Captcha', ['$http', 'CaptchaModel', function ($http, CaptchaModel) {

    function getCaptcha(captchaAction) {
        return $http.post(captchaAction.href).then(function (response) {
            return CaptchaModel.create(response.data);
        });
    }

    return {
        getCaptcha: getCaptcha
    }
}]);
angular.module('nemo').controller('CaptchaCtrl', ['$scope', 'Captcha', function ($scope, Captcha) {

    $scope.requestAnother = function () {
        $scope.captchaModel = undefined;
        $scope.model.value = '';
        Captcha.getCaptcha($scope.model.actions['request-captcha']).then(function (captchaModel) {
            $scope.captchaModel = captchaModel;
            $scope.updateCaptchaId($scope.captchaModel.getId());
        });
    };

    $scope.getRequestCaptchaCopy = function () {
        return $scope.model.actions["request-captcha"].properties.message;
    };

    $scope.requestAnother();
}]);
angular.module('nemo').factory('CaptchaModel', ['$sce', function ($sce) {
    function CaptchaModel(data) {
        var self = this;
        this.data = data;

        if (this.data.links) {
            this.data.links.forEach(function (link) {
                link.rel.forEach(function (relName) {
                    self.data[relName] = link;
                })
            });
        }
    }

    CaptchaModel.prototype = {
        getImageUri: function () {
            return this.data.captchaImage.href;
        },

        getAudioUri: function () {
            return $sce.trustAsResourceUrl(this.data.captchaAudio.href);
        },

        getId: function () {
            return this.data.properties.captchaId;
        }
    };

    return {
        create: function (data) {
            return new CaptchaModel(data);
        }
    }
}]);
'use strict';

angular.module('nemo')

    .directive('formHandler', [function () {
        return {
            require: 'form',
            controller: ['$scope', '$attrs', function ($scope, $attrs) {

                var self = this;

                this.setFieldValue = function(fieldName, value) {
                    if ($scope[$attrs.name][fieldName]) {
                        $scope[$attrs.name][fieldName].$setViewValue(value);
                    }
                };

                this.getFieldValue = function(fieldName) {
                    return $scope[$attrs.name][fieldName] ? $scope[$attrs.name][fieldName].$viewValue : '';
                };

                this.forceValidity = function (fieldName, validationRuleCode, newValidity) {
                    $scope[$attrs.name][fieldName].$setValidity(validationRuleCode, newValidity);
                };

                $scope.$evalAsync(function () {
                    $scope[$attrs.name].forceValidity = self.forceValidity;
                });
            }]
        }
    }]);
'use strict';

angular.module('nemo')

    .directive('nemoInput', ['$compile', function ($compile) {

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
                        attributeValue = 'model.properties.validation[' + $index + '].rules';
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
                if (scope.model.properties && scope.model.properties.validation) {
                    addValidationAttributesToElement(scope.model.properties.validation, fieldElement);
                }
                replaceTemplate(element, fieldElement);
                compileTemplate(fieldElement, scope);
            }
        }
    }]);
'use strict';
angular.module('nemo')

    .factory('messages', [function () {

        var messages = {};

        function set(key, value) {
            messages[key] = value;
        }

        function get(key) {
            return messages[key]
        }

        return {
            set: set,
            get: get
        }
    }]);
'use strict';
angular.module('nemo')

    .directive('nemoValidationMessages', ['messages', function (messages) {

        return {
            scope: {
                model: '='
            },
            template: '<div data-ng-if="model.$dirty && model.$invalid">{{getValidationMessage()}}</div>',
            link: function(scope) {

                scope.getValidationMessage = function() {
                    for(var validationCode in scope.model.$error) {
                        if(scope.model.$error.hasOwnProperty(validationCode)) {
                            return messages.get(validationCode);
                        }
                    }
                };
            }
        }
    }]);