angular.module('nemo', [])

    .config(['nemoInputDirectiveCreatorProvider', 'nemoValidationDirectiveCreatorProvider', 'nemoUtilsProvider', 'captchaProvider', 'checkboxProvider', 'serverValidationProvider',
        function (inputProvider, validationProvider, utilsProvider, captchaProvider, checkboxProvider, serverValidation) {

            inputProvider

                .input('text', {
                    template: '<input type="text" />',
                    defaultValue: ''
                })

                .input('select', {
                    template: '<select data-ng-options="option.value as option.text for option in model.options"><option value="">Please select...</option></select>',
                    defaultValue: ''
                })

                .input('hidden', {
                    template: '<input type="hidden" />',
                    defaultValue: ''
                })

                .input('password', {
                    template: '<input type="password" />',
                    defaultValue: ''
                })

                .input('email', {
                    template: '<input type="text" />',
                    defaultValue: ''
                })

                .input('checkbox', checkboxProvider)

                .input('captcha', captchaProvider);

            validationProvider

                .validation('required', {
                    validateFn: function (value, validationRule, formHandlerController, ngModelController) {
                        return (validationRule.value) ? !ngModelController.$isEmpty(value) : true;
                    }
                })

                .validation('inlist', {
                    validateFn: function (value, validationRule) {
                        return (value) ? utilsProvider.contains(validationRule.value, value) : true;
                    }
                })

                .validation('pattern', {
                    validateFn: function (value, validationRule) {
                        return (value) ? new RegExp(validationRule.value).test(value) : true;
                    }
                })

                .validation('notpattern', {
                    validateFn: function (value, validationRule) {
                        return (value) ? !(new RegExp(validationRule.value).test(value)) : true;
                    }
                })

                .validation('mustnotcontain', {
                    validateFn: function (value, validationRule, formHandlerController) {
                        var targetValue = formHandlerController.getFieldValue(validationRule.value);
                        return (value && targetValue) ? value.indexOf(targetValue) < 0 : true;
                    }
                })

                .validation('mustmatch', {
                    preCompileFn: function (tElement) {
                        tElement.attr('nemo-no-paste', 'true');
                    },
                    validateFn: function (value, validationRule, formHandlerController) {
                        var targetValue = formHandlerController.getFieldValue(validationRule.value);
                        return (value) ? value === targetValue : true;
                    }
                })

                .validation('mustmatchcaseinsensitive', {
                    preCompileFn: function (tElement) {
                        tElement.attr('nemo-no-paste', 'true');
                    },
                    validateFn: function (value, validationRule, formHandlerController) {
                        var targetValue = formHandlerController.getFieldValue(validationRule.value);
                        return (value && targetValue) ? value.toLowerCase() === targetValue.toLowerCase() : true;
                    }
                })

                .validation('minlength', {
                    validateFn: function (value, validationRule) {
                        return (value && validationRule) ? value.length >= validationRule.value : true;
                    }
                })

                .validation('maxlength', {
                    validateFn: function (value, validationRule) {
                        return (value && validationRule) ? value.length <= validationRule.value : true;
                    }
                })

                .validation('email', {
                    validateFn: function (value, validationRule) {
                        if (value && validationRule.value) {
                            return new RegExp(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i).test(value);
                        }
                        return true;
                    }
                })

                .validation('mustbeequal', {
                    validateFn: function (value, validationRule) {
                        return (value || value === false) ? value === validationRule.value : true;
                    }
                })

                .validation('dependentpattern', {
                    validateFn: function (value, validationRule, formHandlerController) {
                        var otherFieldValue = formHandlerController.getFieldValue(validationRule.value),
                            regex = validationRule.patterns[otherFieldValue];
                        return (value) ? new RegExp(regex, 'i').test(value) : true;
                    }
                })

                .validation('dependentrequired', {
                    validateFn: function (value, validationRule, formHandlerController, ngModelController) {
                        var otherFieldValue = formHandlerController.getFieldValue(validationRule.value),
                            required = utilsProvider.contains(validationRule.when, otherFieldValue);

                        return required ? !ngModelController.$isEmpty(value) : true;
                    }
                })

                .validation('usernameserver', serverValidation)

                .validation('emailserver', serverValidation)

                .validation('transactionCompleteserver', {})

                .validation('captchaserver', angular.extend({}, {
                    validationRuleInterfaceFns: function(scope, ngModelCtrl) {
                        return {
                            forceInvalid: function (validationRuleCode) {
                                scope.refreshCaptcha().then(function () {
                                    ngModelCtrl.$setValidity(validationRuleCode, false);
                                });
                            }
                        }
                    }
                }, serverValidation));
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
            '<p class="nemo-captcha-refresh" ng-click="refreshCaptcha($event)">{{getRequestCaptchaCopy()}}</p>' +
            '<input class="nemo-captcha-input" type="text" ng-model="model.value" name="captchaInput" ng-focus="setActiveCaptchaField()" ng-blur="setTouchedCaptchaField()">' +
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
        fieldInterfaceFns: function(scope, element) {
            return {
                setFocus: function () {
                    element.find('input')[0].focus();
                }
            }
        },
        controller: 'CaptchaCtrl',
        $get: {}
    }
}]);
angular.module('nemo').provider('checkbox', [function () {
    return {
        template: '<input type="checkbox" ng-click="setActiveCheckboxField()" />',
        defaultValue: false,
        linkFn: function (scope, element, attrs, controllers) {
            var ngModelCtrl = controllers[0],
                formHandlerCtrl = controllers[1],
                fieldValue = scope.model.value;
            formHandlerCtrl.setFieldValue(scope.model.name, fieldValue === true || fieldValue === 'true');
            scope.setActiveCheckboxField = function () {
                ngModelCtrl.$setTouched();
                scope.setActiveField();
            }
        },
        $get: angular.noop
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
            templateElement.setAttribute('id', 'nemo-{{model.id}}');
            return parentTemplateElement.innerHTML;
        }

        function manageDefaultValue(scope, formHandlerCtrl, defaultValue) {
            var fieldName = scope.model.name,
                unregisterFn = scope.$watch(function () {
                return formHandlerCtrl.getFieldValue(fieldName);
            }, function (fieldValue) {
                if(defaultValue !== undefined && (fieldValue === null || fieldValue === undefined)) {
                    formHandlerCtrl.setFieldValue(fieldName, defaultValue);
                }
                unregisterFn();
            });
        }

        function manageCustomLinkFn(scope, element, attrs, controllers, $compile, $http, linkFn) {
            (linkFn || angular.noop)(scope, element, attrs, controllers, $compile, $http);
        }

        function getLinkFn(options, $compile, $http) {
            return function (scope, element, attrs, controllers) {
                var ngModelCtrl = controllers[0],
                    formHandlerCtrl = controllers[1];

                scope.$watch(function () {
                    return ngModelCtrl.$viewValue;
                }, function (newVal, oldVal) {
                    if (newVal === oldVal || oldVal === undefined) {
                        return;
                    }

                    formHandlerCtrl.validateForm();
                });
                registerField(scope, element, ngModelCtrl, formHandlerCtrl, options.fieldInterfaceFns);
                manageCustomLinkFn(scope, element, attrs, controllers, $compile, $http, options.linkFn);
                manageDefaultValue(scope, formHandlerCtrl, options.defaultValue);
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
                isValid: function () {
                    return ngModelCtrl.$valid;
                },
                isTouched: function () {
                    return ngModelCtrl.$touched;
                },
                isActive: function () {
                    return ngModelCtrl.isActive;
                },
                setFocus: function() {
                    element[0].focus();
                },
                getValue: function () {
                    return ngModelCtrl.$viewValue;
                },
                setValue: function (value) {
                    ngModelCtrl.$setViewValue(value);
                    ngModelCtrl.$render();
                },
                getNgModelCtrl: function () {
                    return ngModelCtrl;
                },
                setFilthy: function () {
                    ngModelCtrl.$setDirty();
                    ngModelCtrl.$setTouched();
                }
            }
        }

        function activeFieldChange(scope, ngModelCtrl, activeField) {
            ngModelCtrl.isActive = (activeField === scope.model.name);
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

angular.module('nemo').provider('serverValidation', function () {
    return {
        linkFn: function (scope, element, attrs, controllers, validFns) {
            var ngModelCtrl = controllers[0];

            scope.$watch(function () {
                return ngModelCtrl.$viewValue;
            }, function (newVal, oldVal) {
                if (newVal === oldVal) { return; }

                validFns.forceValid();
            });
        },
        $get: {}
    }
});
'use strict';

angular.module('nemo')

    .provider('nemoValidationDirectiveCreator', ['$compileProvider', 'nemoUtilsProvider', function ($compileProvider, utilsProvider) {

        var validationOptionsCache = {};

        function getValidity(validateFn, validationRule, ngModelCtrl, formHandlerCtrl) {
            var isValid = angular.isFunction(validateFn) ?
                validateFn(ngModelCtrl.$viewValue, validationRule, formHandlerCtrl, ngModelCtrl) :
                ngModelCtrl.$valid;
            return isValid;
        }

        function setupValidationRule(validationRule, ngModelCtrl, formHandlerCtrl, validateFn, messages) {
            ngModelCtrl.$validators[validationRule.code] = function () {
                return getValidity(validateFn, validationRule, ngModelCtrl, formHandlerCtrl);
            };
            messages.set(validationRule.code, validationRule.message);
        }

        function registerValidationRule(validationRule, formHandlerCtrl, validationRuleInterfaceFns) {
            formHandlerCtrl.registerValidationRule(validationRule.code, validationRuleInterfaceFns);
        }

        function getValidationRuleInterfaceFnsObject(scope, validateFn, validationRule, ngModelCtrl, formHandlerCtrl, options) {
            var validationRuleInterfaceFns = getValidationRuleInterfaceFns(validateFn, validationRule, ngModelCtrl, formHandlerCtrl),
                customerValidationRuleInterface = options.validationRuleInterfaceFns ?
                    options.validationRuleInterfaceFns(scope, ngModelCtrl) :
                {};
            angular.extend(validationRuleInterfaceFns, customerValidationRuleInterface);
            return validationRuleInterfaceFns
        }

        function getValidationRuleInterfaceFns(validateFn, validationRule, ngModelCtrl, formHandlerCtrl) {
            return {
                forceInvalid: function () {
                    validityChange(ngModelCtrl, validationRule.code, false);
                },
                forceValid: function () {
                    validityChange(ngModelCtrl, validationRule.code, true);
                },
                refreshValidity: function () {
                    refreshValidity(validateFn, validationRule, ngModelCtrl, formHandlerCtrl);
                }
            };
        }

        function validityChange(ngModelCtrl, validationRuleCode, newValidity) {
            ngModelCtrl.$setValidity(validationRuleCode, newValidity);
        }

        function refreshValidity(validateFn, validationRule, ngModelCtrl, formHandlerCtrl) {
            var isValid = getValidity(validateFn, validationRule, ngModelCtrl, formHandlerCtrl);
            ngModelCtrl.$setValidity(validationRule.code, isValid);
        }

        function getLinkFn(options, directiveName, validateFn, messages) {
            return function (scope, element, attrs, controllers) {
                var validationRules = scope.$eval(attrs[directiveName]),
                    ngModelCtrl = controllers[0],
                    formHandlerCtrl = controllers[1];

                validationRules.forEach(function (validationRule) {
                    var validFns = getValidationRuleInterfaceFnsObject(scope, validateFn, validationRule, ngModelCtrl, formHandlerCtrl, options);

                    setupValidationRule(validationRule, ngModelCtrl, formHandlerCtrl, validateFn, messages);
                    registerValidationRule(validationRule, formHandlerCtrl, validFns);

                    if (options.linkFn) {
                        options.linkFn(scope, element, attrs, controllers, validFns);
                    }
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

        var registeredFieldsFns = {}, registeredValidationRulesFns = {}, fieldNameOrder = [];

        function getRegisteredField(fieldName) {
            return getRegisteredComponent(fieldName, registeredFieldsFns);
        }

        function getRegisteredValidationRule(validationRuleCode) {
            return getRegisteredComponent(validationRuleCode, registeredValidationRulesFns);
        }

        function getRegisteredComponent(id, group) {
            var registeredComponent = group[id];
            if (!registeredComponent) {
                throw new Error(id + ' is not registered in the form.');
            }
            return registeredComponent;
        }

        this.setFieldValue = function (fieldName, value) {
            getRegisteredField(fieldName).setValue(value);
        };

        this.getFieldsValues = function () {
            var fieldsValues = {};
            angular.forEach(registeredFieldsFns, function (fieldInterfaceFns, fieldName) {
                fieldsValues[fieldName] = fieldInterfaceFns.getValue();
            });
            return fieldsValues;
        };

        this.getFieldValue = function (fieldName) {
            return getRegisteredField(fieldName).getValue();
        };


        this.isFieldValid = function (fieldName) {
            return getRegisteredField(fieldName).isValid();
        };

        this.isFieldTouched = function (fieldName) {
            return getRegisteredField(fieldName).isTouched();
        };

        this.isFieldActive = function (fieldName) {
            return getRegisteredField(fieldName).isActive();
        };

        this.getFieldNgModelCtrl = function (fieldName) {
            return getRegisteredField(fieldName).getNgModelCtrl();
        };

        this.forceInvalid = function (validationRuleCode) {
            getRegisteredValidationRule(validationRuleCode).forceInvalid(validationRuleCode);
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
            angular.forEach(registeredFieldsFns, function (fieldInterfaceFns) {
                fieldInterfaceFns.activeFieldChange(activeFieldName);
            });
        };

        this.validateFormAndSetDirtyTouched = function () {
            angular.forEach(registeredValidationRulesFns, function (registeredValidationRuleFns) {
                registeredValidationRuleFns.refreshValidity();
            });
            angular.forEach(registeredFieldsFns, function (registeredFieldFns) {
                registeredFieldFns.setFilthy();
            });
        };

        this.validateForm = function () {
            angular.forEach(registeredValidationRulesFns, function (registeredValidationRuleFns) {
                registeredValidationRuleFns.refreshValidity();
            });
        };

        this.registerField = function (fieldName, registerFieldFns) {
            registeredFieldsFns[fieldName] = registerFieldFns;
            fieldNameOrder.push(fieldName);
        };

        this.registerValidationRule = function (validationRuleCode, registerValidationRuleFns) {
            registeredValidationRulesFns[validationRuleCode] = registerValidationRuleFns;
        };
    }])

    .directive('nemoFormHandler', [function () {
        return {
            require: ['nemoFormHandler', 'form'],
            controller: 'nemoFormHandlerCtrl',
            link: function (scope, element, attrs, controllers) {

                var formHandlerCtrl = controllers[0],
                    formCtrl = controllers[1];

                formHandlerCtrl.isFormValid = function () {
                    return formCtrl.$valid;
                };
            }
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
            if (validationOptions && angular.isFunction(validationOptions.preCompileFn)) {
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