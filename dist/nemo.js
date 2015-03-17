angular.module('nemo', [])

    .config(['nemoInputDirectiveCreatorProvider', 'nemoValidationDirectiveCreatorProvider', 'nemoUtilsProvider', 'captchaProvider',
        function (inputProvider, validationProvider, utilsProvider, captchaProvider) {

            inputProvider

                .input('text', {
                    template: '<input type="text" />'
                })

                .input('select', {
                    template: '<select data-ng-options="option.value as option.text for option in model.options"><option value="">Please select...</option></select>'
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
                    template: '<input type="checkbox" ng-click="setActiveCheckboxField()" />',
                    linkFn: function(scope, element, attrs, controllers) {
                        scope.setActiveCheckboxField = function () {
                            var ngModelCtrl = controllers[0];
                            ngModelCtrl.$setTouched();
                            scope.setActiveField();
                        }
                    }
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
                    preCompileFn: function (tElement) {
                        tElement.attr('nemo-no-paste', 'true');
                    },
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
                })

                .validation('server', {});

    }]);
'use strict';
angular.module('nemo')

    .provider('nemoUtils', [function () {

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

        // Extracted from Underscore.js 1.5.2
        function debounce(func, wait, immediate) {
            var timeout, args, context, timestamp, result;
            return function() {
                context = this;
                args = arguments;
                timestamp = new Date();
                var later = function() {
                    var last = (new Date()) - timestamp;
                    if (last < wait) {
                        timeout = setTimeout(later, wait - last);
                    } else {
                        timeout = null;
                        if (!immediate) result = func.apply(context, args);
                    }
                };
                var callNow = immediate && !timeout;
                if (!timeout) {
                    timeout = setTimeout(later, wait);
                }
                if (callNow) result = func.apply(context, args);
                return result;
            };
        }

        return {
            capitalise: capitalise,
            contains: contains,
            debounce: debounce,
            $get: function () {
                return {
                    capitalise: capitalise,
                    contains: contains,
                    debounce: debounce
                }
            }
        }
    }]);
angular.module('nemo').provider('captcha', [function () {
    return {
        template: '<div class="nemo-captcha">' +
            '<img class="nemo-captcha-img" ng-src="{{captchaModel.getImageUri()}}">' +
            '<div class="nemo-captcha-play" ng-click="playAudio($event)"></div>' +
            '<input class="nemo-captcha-input" type="text" ng-model="model.value" name="captchaInput" ng-focus="setActiveCaptchaField()" ng-blur="setTouchedCaptchaField()">' +
            '<div class="nemo-captcha-refresh" ng-click="refreshCaptcha($event)">{{getRequestCaptchaCopy()}}</div>' +
            '<audio class="nemo-captcha-audio" ng-src="{{captchaModel.getAudioUri()}}">' +
                'Your browser does not support audio' +
            '</audio>' +
        '</div>',
        linkFn: function (scope, element, attrs, controllers) {
            var ngModelCtrl = controllers[0],
                formHandlerCtrl = controllers[1],
                watcherUnbind = scope.$watch('model.value', function (newVal, oldVal) {
                    if(newVal !== oldVal) {
                        ngModelCtrl.$setDirty();
                        watcherUnbind();
                    }
                });

            scope.updateCaptchaId = function(value) {
                formHandlerCtrl.setFieldValue('captchaId', value);
            };

            scope.playAudio = function ($event) {
                $event.stopPropagation();
                $event.preventDefault();
                element.find('audio')[0].play();
            };

            scope.setActiveCaptchaField = function () {
                formHandlerCtrl.setActiveField(scope.model.name);
            };

            scope.setTouchedCaptchaField = function () {
                ngModelCtrl.$setTouched();
            };
        },
        fieldInterfaceFns: function(scope, element, ngModelCtrl) {
            return {
                setFocus: function () {
                    element.find('input')[0].focus();
                },
                forceInvalid: function (validationRuleCode) {
                    ngModelCtrl.$setTouched();
                    scope.refreshCaptcha().then(function () {
                        ngModelCtrl.$setValidity(validationRuleCode, false);
                    });
                }
            }
        },
        controller: 'CaptchaCtrl',
        $get: {}
    }
}]);
'use strict';

angular.module('nemo')

    .provider('nemoInputDirectiveCreator', ['$compileProvider', 'nemoUtilsProvider', function ($compileProvider, utilsProvider) {

        function getTemplateWithAttributes(template) {
            var parentTemplateElement, templateElement;
            parentTemplateElement = document.createElement('div');
            parentTemplateElement.innerHTML = template;
            templateElement = parentTemplateElement.firstChild;
            templateElement.setAttribute('ng-model', 'model.value');
            templateElement.setAttribute('ng-focus', 'setActiveField()');
            templateElement.setAttribute('name', '{{model.name}}');
            return parentTemplateElement.innerHTML;
        }

        function getLinkFn(options, $compile, $http) {
            return function (scope, element, attrs, controllers) {
                var ngModelCtrl = controllers[0],
                    formHandlerCtrl = controllers[1];
                if (options.linkFn) {
                    options.linkFn(scope, element, attrs, controllers, $compile, $http);
                }
                registerField(scope, element, ngModelCtrl, formHandlerCtrl, options.fieldInterfaceFns);
                handleActivationState(scope, formHandlerCtrl);
            }
        }

        function handleActivationState(scope, formHandlerCtrl) {
            scope.setActiveField = function () {
                formHandlerCtrl.setActiveField(scope.model.name);
            };
        }

        function registerField(scope, element, ngModelCtrl, formHandlerCtrl, customFieldInterfaceFns) {
            var fieldInterfaceFns = getFieldInterfaceFns(scope, element, ngModelCtrl),
                customerFieldInterface = customFieldInterfaceFns ? customFieldInterfaceFns(scope, element, ngModelCtrl) : {};

            angular.extend(fieldInterfaceFns, customerFieldInterface);
            formHandlerCtrl.registerField(scope.model.name, fieldInterfaceFns);
        }

        function getFieldInterfaceFns(scope, element, ngModelCtrl) {
            return {
                activeFieldChange: function (activeField) {
                    activeFieldChange(scope, ngModelCtrl, activeField)
                },
                forceInvalid: function (validationRuleCode) {
                    validityChange(ngModelCtrl, validationRuleCode, false);
                },
                isValid: function () {
                    return ngModelCtrl.$valid;
                },
                setFocus: function() {
                    element[0].focus();
                },
                getValue: function () {
                    return ngModelCtrl.$viewValue;
                },
                setValue: function (value) {
                    ngModelCtrl.$setViewValue(value);
                },
                forceDirty: function () {
                    ngModelCtrl.$setDirty();
                }
            }
        }

        function activeFieldChange(scope, ngModelCtrl, activeField) {
            ngModelCtrl.isActive = (activeField === scope.model.name);
        }

        function validityChange(ngModelCtrl, validationRuleCode, newValidity) {
            ngModelCtrl.$setTouched();
            ngModelCtrl.$setValidity(validationRuleCode, newValidity);
        }

        function getDirectiveDefinitionObject(options, $compile, $http) {
            return {
                require: ['ngModel', '^nemoFormHandler'],
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
angular.module('nemo').controller('CaptchaCtrl', ['$scope', 'Captcha', 'nemoUtils', function ($scope, Captcha, utils) {

    var debouncedGetCaptchaInfo = utils.debounce(getCaptchaInfo, 1000, true);

    function getCaptchaInfo() {
        $scope.model.value = '';
        return Captcha.getCaptcha($scope.model.actions['request-captcha']).then(function (captchaModel) {
            $scope.captchaModel = captchaModel;
            $scope.updateCaptchaId($scope.captchaModel.getId());
        });
    }

    $scope.refreshCaptcha = function ($event) {
        if ($event) {
            $event.stopPropagation();
            $event.preventDefault();
        }
        return debouncedGetCaptchaInfo();
    };

    $scope.getRequestCaptchaCopy = function () {
        return $scope.model.actions["request-captcha"].properties.actionsubmit.message;
    };

    getCaptchaInfo();
}]);
angular.module('nemo').factory('CaptchaModel', ['$sce', function ($sce) {
    function CaptchaModel(data) {
        var self = this;
        this.data = data;

        if (this.data.links) {
            this.data.links.forEach(function (link) {
                link.rel.forEach(function (relName) {
                    self.data[relName] = link;
                });
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

    .controller('nemoFormHandlerCtrl', [function () {

        var registerFieldsFns = {}, fieldNameOrder = [];

        function getRegisteredField(fieldName) {
            var registeredField = registerFieldsFns[fieldName];
            if (!registeredField) {
                throw new Error(fieldName + ' is not registered in the form.');
            }
            return registeredField;
        }

        this.setFieldValue = function (fieldName, value) {
            getRegisteredField(fieldName).setValue(value);
        };

        this.getFieldValue = function (fieldName) {
            return getRegisteredField(fieldName).getValue();
        };

        this.forceInvalid = function (fieldName, validationRuleCode) {
            getRegisteredField(fieldName).forceInvalid(validationRuleCode);
        };

        this.forceAllFieldsToBeDirty = function () {
            angular.forEach(registerFieldsFns, function (fieldInterfaceFns) {
                fieldInterfaceFns.forceDirty();
            });
        };

        this.giveFirstFieldFocus = function () {
            getRegisteredField(fieldNameOrder[0]).setFocus();
        };

        this.giveFirstInvalidFieldFocus = function () {
            var fieldFns;
            for(var index = 0; index < fieldNameOrder.length; index++) {
                fieldFns = getRegisteredField(fieldNameOrder[index]);
                if(!fieldFns.isValid()) {
                    fieldFns.setFocus();
                    break;
                }
            }
        };

        this.setActiveField = function (activeFieldName) {
            angular.forEach(registerFieldsFns, function (fieldInterfaceFns) {
                fieldInterfaceFns.activeFieldChange(activeFieldName);
            });
        };

        this.registerField = function (fieldName, registerFieldFns) {
            registerFieldsFns[fieldName] = registerFieldFns;
            fieldNameOrder.push(fieldName);
        };
    }])

    .directive('nemoFormHandler', [function () {
        return {
            controller: 'nemoFormHandlerCtrl'
        }
    }]);
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
'use strict';

angular.module('nemo')
    .directive('nemoNoPaste', [function () {
        return {
            link: function(scope, element, attributes) {
                if (scope.$eval(attributes.nemoNoPaste)) {
                    element.on('paste', function (ev) {
                        ev.preventDefault();
                        ev.stopPropagation();
                    });
                }
            }
        }
    }]);
'use strict';
angular.module('nemo')

    .factory('nemoMessages', [function () {

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

    .directive('nemoValidationMessages', ['nemoMessages', function (messages) {

        return {
            scope: {
                model: '='
            },
            template:   '<div data-ng-if="(model.$dirty || model.$touched) && model.$invalid" data-t-validation-code="{{validationCode}}" class="field-error">' +
                            '{{getValidationMessage()}}' +
                        '</div>',
            link: function(scope) {

                scope.getValidationMessage = function() {
                    for(var validationCode in scope.model.$error) {
                        if(scope.model.$error.hasOwnProperty(validationCode)) {
                            scope.validationCode = validationCode;
                            return messages.get(validationCode);
                        }
                    }
                };
            }
        }
    }]);