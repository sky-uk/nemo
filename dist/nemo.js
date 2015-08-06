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
                    template: '<input type="hidden" ng-value="model.value" />',
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
                        var targetValue = formHandlerController.getFieldValue(validationRule.value, true);
                        return (value && targetValue) ? value.toLowerCase().indexOf(targetValue.toLowerCase()) < 0 : true;
                    }
                })

                .validation('mustmatch', {
                    validateFn: function (value, validationRule, formHandlerController) {
                        var targetValue = formHandlerController.getFieldValue(validationRule.value, true);
                        return (value) ? value === targetValue : true;
                    }
                })

                .validation('mustmatchcaseinsensitive', {
                    validateFn: function (value, validationRule, formHandlerController) {
                        var targetValue = formHandlerController.getFieldValue(validationRule.value, true);
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
                        var otherFieldValue = formHandlerController.getFieldValue(validationRule.value, true),
                            regex = validationRule.patterns[otherFieldValue];
                        return (value) ? new RegExp(regex, 'i').test(value) : true;
                    }
                })

                .validation('dependentrequired', {
                    validateFn: function (value, validationRule, formHandlerController, ngModelController) {
                        var otherFieldValue = formHandlerController.getFieldValue(validationRule.value, true),
                            required = utilsProvider.contains(validationRule.when, otherFieldValue);

                        return required ? !ngModelController.$isEmpty(value) : true;
                    }
                })

                .validation('server', serverValidation);
    }]);
'use strict';
angular.module('nemo')

    .provider('nemoMessages', [function () {

        var messages = {};

        function set(key, value) {
            messages[key] = value;
        }

        function get(key) {
            return messages[key]
        }

        return {
            set: set,
            get: get,
            $get: function () {
                return {
                    set: set,
                    get: get
                }
            }
        }
    }]);
angular.module('nemo')

    .provider('nemoUtils', ['nemoMessagesProvider', function (messagesProvider) {

        'use strict';

        function capitalise(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function contains(list, item) {
            var isFound = false;
            if (list && list.length) {
                angular.forEach(list, function (listItem) {
                    isFound = isFound || (item === listItem);
                });
            }
            return isFound;
        }

        // Extracted from Underscore.js 1.5.2
        function debounce(func, wait, immediate) {
            var timeout, args, context, timestamp, result;
            return function () {
                context = this;
                args = arguments;
                timestamp = new Date();
                var later = function () {
                    var last = (new Date()) - timestamp;
                    if (last < wait) {
                        timeout = setTimeout(later, wait - last);
                    } else {
                        timeout = null;
                        if (!immediate) {
                            result = func.apply(context, args);
                        }
                    }
                };
                var callNow = immediate && !timeout;
                if (!timeout) {
                    timeout = setTimeout(later, wait);
                }
                if (callNow) {
                    result = func.apply(context, args);
                }
                return result;
            };
        }

        function forceServerInvalid(errorMessage, errorIndex, scope, ngModelCtrl) {
            var validationId = scope.model.name + errorIndex;
            messagesProvider.set(validationId, errorMessage);
            ngModelCtrl.$setValidity(validationId, false);
            setValidOnChange(scope, ngModelCtrl, validationId);
        }

        function setValidOnChange(scope, ngModelCtrl, validationId) {
            var unregisterFn = scope.$watch(function () {
                return ngModelCtrl.$viewValue;
            }, function (newValue, oldValue) {
                //noinspection JSValidateTypes
                if (newValue !== oldValue) {
                    ngModelCtrl.$setValidity(validationId, true);
                    unregisterFn();
                }
            });
        }

        return {
            capitalise: capitalise,
            contains: contains,
            debounce: debounce,
            forceServerInvalid: forceServerInvalid,
            $get: function () {
                return {
                    capitalise: capitalise,
                    contains: contains,
                    debounce: debounce
                };
            }
        };
    }]);
angular.module('nemo').provider('captcha', ['nemoUtilsProvider', function (utilsProvider) {
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
        fieldInterfaceFns: function(scope, element, ngModelCtrl) {
            return {
                setFocus: function () {
                    element.find('input')[0].focus();
                },
                forceServerInvalid: function (errorMessage, errorIndex) {
                    scope.refreshCaptcha();
                    utilsProvider.forceServerInvalid(errorMessage, errorIndex, scope, ngModelCtrl);
                }
            }
        },
        controller: 'CaptchaCtrl',
        $get: {}
    }
}]);
angular.module('nemo').provider('checkbox', [function () {
    return {
        template: '<div data-ng-click="toggle()" data-ng-keyup="toggleIfEnter($event)" data-ng-class="{checked: isChecked, focused: isFocused()}">' +
        '<label class="tick" data-ng-show="isChecked">\u2714</label>' +
        '<input type="text" data-ng-focus="setFocus()" data-ng-blur="releaseFocus()" ' +
            'style="position: absolute; top: 0; left: 0; width: 0; height: 0; opacity: 0; cursor: pointer; font-size: 0; color: transparent; text-indent: 100%; padding: 0; border: none;" />' +
        '</div>',
        defaultValue: false,
        linkFn: function (scope, element, attrs, controllers) {

            var ngModelCtrl = controllers[0],
                formHandlerCtrl = controllers[1],
                fieldValue = scope.model.value,
                fieldName = scope.model.name,
                hasGenuineFocus = false;

            setValue(fieldValue === true || fieldValue === 'true');

            scope.isFocused = function () {
                return hasGenuineFocus && ngModelCtrl.isActive;
            };

            scope.toggle = function () {
                setValue(!scope.isChecked);
                scope.setFocus();
                formHandlerCtrl.setFieldDirtyTouched(fieldName);
            };

            scope.toggleIfEnter = function ($event) {
                var spaceKeyCode = 32;
                if ($event.which === spaceKeyCode) {
                    scope.toggle();
                }
            };

            scope.setFocus = function () {
                hasGenuineFocus = true;
                setActiveState();
            };

            scope.releaseFocus = function () {
                hasGenuineFocus = false;
                formHandlerCtrl.setFieldDirtyTouched(fieldName);
            };

            function setValue(value) {
                scope.isChecked = value;
                formHandlerCtrl.setFieldValue(fieldName, value);
            }

            function setActiveState() {
                formHandlerCtrl.setActiveField(fieldName);
            }
        },
        $get: angular.noop
    }
}]);
/* jshint -W040 */

angular.module('nemo')

    .provider('nemoInputDirectiveCreator', ['$compileProvider', 'nemoUtilsProvider',
        function ($compileProvider, utilsProvider) {

            'use strict';

            function getTemplateWithAttributes(template) {
                var parentTemplateElement, templateElement;
                parentTemplateElement = document.createElement('div');
                parentTemplateElement.innerHTML = template;
                templateElement = parentTemplateElement.firstChild;
                templateElement.setAttribute('ng-model', 'model.value');
                templateElement.setAttribute('ng-focus', 'setActiveField()');
                templateElement.setAttribute('name', '{{model.name}}');
                templateElement.setAttribute('id', 'nemo-{{model.name}}');
                return parentTemplateElement.innerHTML;
            }

            function manageDefaultValue(scope, formHandlerCtrl, defaultValue) {
                var fieldName = scope.model.name,
                    unregisterFn = scope.$watch(function () {
                        return formHandlerCtrl.getFieldValue(fieldName);
                    }, function (fieldValue) {
                        if (defaultValue !== undefined && (fieldValue === null || fieldValue === undefined)) {
                            formHandlerCtrl.setFieldValue(fieldName, defaultValue);
                        }
                        unregisterFn();
                    });
            }

            function manageCustomLinkFn(scope, element, attrs, controllers, $compile, $http, linkFn) {
                (linkFn || angular.noop)(scope, element, attrs, controllers, $compile, $http);
            }

            function validateFormOnFieldChange(scope, ngModelCtrl, formHandlerCtrl) {
                scope.$watch(function () {
                    return ngModelCtrl.$viewValue;
                }, function (newVal, oldVal) {
                    scope.$evalAsync(function () {
                        //noinspection JSValidateTypes
                        if (newVal === oldVal) {
                            return;
                        }
                        ngModelCtrl.forcedValidityValue = undefined;
                        formHandlerCtrl.validateForm();
                    });
                });
            }

            function getLinkFn(options, $compile, $http, nemoMessages) {
                return function (scope, element, attrs, controllers) {
                    var ngModelCtrl = controllers[0],
                        formHandlerCtrl = controllers[1],
                        parentNgModelCtrl = controllers[2];
                    validateFormOnFieldChange(scope, ngModelCtrl, formHandlerCtrl);

                    var interfaceFuns = registerField(scope, element, ngModelCtrl, formHandlerCtrl, nemoMessages, options.fieldInterfaceFns);
                    interfaceFuns.setupBusinessRules();

                    manageCustomLinkFn(scope, element, attrs, controllers, $compile, $http, options.linkFn);
                    manageDefaultValue(scope, formHandlerCtrl, options.defaultValue);
                    handleActivationState(scope, formHandlerCtrl, parentNgModelCtrl);
                };
            }

            function handleActivationState(scope, formHandlerCtrl, parentNgModelCtrl) {
                var newActiveField = (parentNgModelCtrl) ? [parentNgModelCtrl.$name, scope.model.name] : scope.model.name;
                scope.setActiveField = function () {
                    formHandlerCtrl.setActiveField(newActiveField);
                };
            }

            function registerField(scope, element, ngModelCtrl, formHandlerCtrl, nemoMessages, customFieldInterfaceFns) {
                var fieldInterfaceFns = getFieldInterfaceFns(scope, element, ngModelCtrl, formHandlerCtrl, nemoMessages),
                    customerFieldInterface = customFieldInterfaceFns ? customFieldInterfaceFns(scope, element, ngModelCtrl, formHandlerCtrl) : {};
                angular.extend(fieldInterfaceFns, customerFieldInterface);
                formHandlerCtrl.registerField(scope.model.name, fieldInterfaceFns);
                return fieldInterfaceFns;
            }

            function getFieldInterfaceFns(scope, element, ngModelCtrl, formHandlerCtrl, nemoMessages) {
                return {
                    activeFieldChange: function (activeField) {
                        activeFieldChange(scope, ngModelCtrl, activeField);
                    },
                    releaseActive: function () {
                        ngModelCtrl.isActive = false;
                    },
                    isActive: function () {
                        return ngModelCtrl.isActive;
                    },
                    isValid: function () {
                        return ngModelCtrl.$valid;
                    },
                    isTouched: function () {
                        return ngModelCtrl.$touched;
                    },
                    hasHelp: function () {
                        return scope.model.properties && scope.model.properties.help && scope.model.properties.help.message;
                    },
                    setFocus: function () {
                        element[0].focus();
                        formHandlerCtrl.setActiveField(scope.model.name);
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
                    },
                    setupBusinessRules: function () {
                        if (scope.model.properties && scope.model.properties.businessrules) {
                            if (utilsProvider.contains(scope.model.properties.businessrules, 'noAutocomplete')) {
                                element.attr('autocomplete', 'off');
                            }
                            if (utilsProvider.contains(scope.model.properties.businessrules, 'noPaste')) {
                                element.attr('onPaste', 'return false;');
                            }
                        }
                    },
                    forceServerInvalid: function (errorMessage, errorIndex) {
                        utilsProvider.forceServerInvalid(errorMessage,errorIndex, scope, ngModelCtrl);
                    }
                };
            }

            function activeFieldChange(scope, ngModelCtrl, activeField) {
                ngModelCtrl.isActive = isFieldNowActive(scope.model.name, activeField);
            }

            function isFieldNowActive(fieldName, activeField) {
                if (typeof activeField === 'string') {
                    return isFieldTheOnlyActiveOne(fieldName, activeField);
                } else if (typeof activeField === 'object') {
                    return isFieldPartOfActiveList(fieldName, activeField);
                }
            }

            function isFieldTheOnlyActiveOne(fieldName, activeField) {
                return activeField === fieldName;
            }

            function isFieldPartOfActiveList(fieldName, activeFieldList) {
                var isFieldNowActive = false;
                for (var i = 0; i < activeFieldList.length; i++) {
                    if (activeFieldList[i] === fieldName) {
                        isFieldNowActive = true;
                        break;
                    }
                }
                return isFieldNowActive;
            }

            function getDirectiveDefinitionObject(options, $compile, $http, nemoMessages) {
                return {
                    require: ['ngModel', '^nemoFormHandler', '?^^ngModel'],
                    template: getTemplateWithAttributes(options.template),
                    replace: true,
                    restrict: 'A',
                    link: getLinkFn(options, $compile, $http, nemoMessages),
                    controller: options.controller
                };
            }

            function input(type, options) {
                $compileProvider.directive
                    .apply(null, [
                        'input' + utilsProvider.capitalise(type),
                        ['$compile', '$http', 'nemoMessages', function ($compile, $http, nemoMessages) {
                            return getDirectiveDefinitionObject(options, $compile, $http, nemoMessages);
                        }]]);
                return this;
            }

            return {
                input: input,
                $get: angular.noop
            };
        }
    ]);

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
            var isValid;
            if(ngModelCtrl.forcedValidityValue !== undefined) {
                isValid = ngModelCtrl.forcedValidityValue;
            } else if(angular.isFunction(validateFn)) {
                isValid = validateFn(ngModelCtrl.$viewValue, validationRule, formHandlerCtrl, ngModelCtrl);
            } else {
                isValid = !ngModelCtrl.$error[validationRule.id];
            }
            return isValid;
        }

        function setupValidationRule(validationRule, ngModelCtrl, formHandlerCtrl, validateFn, messages) {
            ngModelCtrl.$validators[validationRule.id] = function () {
                return getValidity(validateFn, validationRule, ngModelCtrl, formHandlerCtrl);
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
                    refreshValidity(validateFn, validationRule, ngModelCtrl, formHandlerCtrl);
                }
            };
        }

        function validityChange(ngModelCtrl, validationRuleCode, newValidity) {
            ngModelCtrl.$setValidity(validationRuleCode, newValidity);
            ngModelCtrl.forcedValidityValue = newValidity;
        }

        function refreshValidity(validateFn, validationRule, ngModelCtrl, formHandlerCtrl) {
            var isValid = getValidity(validateFn, validationRule, ngModelCtrl, formHandlerCtrl);
            ngModelCtrl.$setValidity(validationRule.id, isValid);
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
                };
            }
        };
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
        return Captcha.getCaptcha($scope.model.action).then(function (captchaModel) {
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
        return $scope.model.action.properties.actionsubmit.message;
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

    .controller('nemoFormHandlerCtrl', ['$scope', '$timeout', '$element', function ($scope, $timeout, $element) {

        var registeredFieldsFns = {}, registeredValidationRulesFns = {}, fieldNameOrder = [];

        function getRegisteredField(fieldName, skipRegisteredCheck) {
            return getRegisteredComponent(fieldName, registeredFieldsFns, skipRegisteredCheck);
        }

        function getRegisteredValidationRule(validationRuleCode, skipRegisteredCheck) {
            return getRegisteredComponent(validationRuleCode, registeredValidationRulesFns, skipRegisteredCheck);
        }

        function getRegisteredComponent(id, group, skipRegisteredCheck) {
            var registeredComponent = group[id];
            if (!registeredComponent) {
                if(skipRegisteredCheck) {
                    return {};
                } else {
                    throw new Error(id + ' is not registered in the form.');
                }
            } else {
                return registeredComponent;
            }
        }

        function getFieldInterfaceFn(fieldName, interfaceFn, skipRegisteredCheck) {
            return (getRegisteredField(fieldName, skipRegisteredCheck)[interfaceFn] || angular.noop);
        }

        function getValidationRuleInterfaceFn(fieldName, interfaceFn, skipRegisteredCheck) {
            return (getRegisteredValidationRule(fieldName, skipRegisteredCheck)[interfaceFn] || angular.noop);
        }

        this.getFieldsValues = function () {
            var fieldsValues = {};
            angular.forEach(registeredFieldsFns, function (fieldInterfaceFns, fieldName) {
                fieldsValues[fieldName] = fieldInterfaceFns.getValue();
            });
            return fieldsValues;
        };

        this.setFieldValue = function (fieldName, value, skipRegisteredCheck) {
            getFieldInterfaceFn(fieldName, 'setValue', skipRegisteredCheck)(value);
        };

        this.getFieldValue = function (fieldName, skipRegisteredCheck) {
            return getFieldInterfaceFn(fieldName, 'getValue', skipRegisteredCheck)();
        };


        this.isFieldValid = function (fieldName, skipRegisteredCheck) {
            return getFieldInterfaceFn(fieldName, 'isValid', skipRegisteredCheck)();
        };

        this.isFieldTouched = function (fieldName, skipRegisteredCheck) {
            return getFieldInterfaceFn(fieldName, 'isTouched', skipRegisteredCheck)();
        };

        this.hasHelp = function (fieldName, skipRegisteredCheck) {
            return getFieldInterfaceFn(fieldName, 'hasHelp', skipRegisteredCheck)();
        };

        this.isFieldActive = function (fieldName, skipRegisteredCheck) {
            return getFieldInterfaceFn(fieldName, 'isActive', skipRegisteredCheck)();
        };

        this.getFieldNgModelCtrl = function (fieldName, skipRegisteredCheck) {
            return getFieldInterfaceFn(fieldName, 'getNgModelCtrl', skipRegisteredCheck)();
        };

        this.forceInvalid = function (validationRuleCode, skipRegisteredCheck) {
            getValidationRuleInterfaceFn(validationRuleCode, 'forceInvalid', skipRegisteredCheck)(validationRuleCode);
        };

        this.forceServerFieldInvalid = function (fieldName, errorMessage, index, skipRegisteredCheck) {
            return getFieldInterfaceFn(fieldName, 'forceServerInvalid', skipRegisteredCheck)(errorMessage, index);
        };

        this.setActiveField = function (activeFieldName, skipRegisteredCheck) {
            angular.forEach(registeredFieldsFns, function (fieldInterfaceFns, fieldName) {
                getFieldInterfaceFn(fieldName, 'activeFieldChange', skipRegisteredCheck)(activeFieldName);
            });
        };

        this.releaseActiveField = function (fieldName, skipRegisteredCheck) {
            getFieldInterfaceFn(fieldName, 'releaseActive', skipRegisteredCheck)(fieldName);
        };

        this.setFieldDirtyTouched = function (fieldName, skipRegisteredCheck) {
            getFieldInterfaceFn(fieldName, 'setFilthy', skipRegisteredCheck)();
        };

        this.validateFormAndSetDirtyTouched = function () {
            angular.forEach(registeredValidationRulesFns, function (registeredValidationRuleFns) {
                registeredValidationRuleFns.refreshValidity();
            });
            angular.forEach(registeredFieldsFns, function (registeredFieldFns) {
                registeredFieldFns.setFilthy();
            });
        };

        this.validateForm = function (skipRegisteredCheck) {
            angular.forEach(registeredValidationRulesFns, function (registeredValidationRuleFns, validationRuleCode) {
                getValidationRuleInterfaceFn(validationRuleCode, 'refreshValidity', skipRegisteredCheck)();
            });
        };

        this.giveFieldFocus = function (fieldName, skipRegisteredCheck) {
            getFieldInterfaceFn(fieldName, 'setFocus', skipRegisteredCheck)();
        };

        this.giveFirstInvalidFieldFocus = function () {
            $timeout(function() {
                angular.element($element).find('input.ng-invalid,select.ng-invalid,.field.ng-invalid input, .field.ng-invalid select').first().focus()
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
        };
    }]);
'use strict';

angular.module('nemo')

    .directive('nemoInput', ['$compile', 'nemoValidationDirectiveCreator', function ($compile, validation) {

        function toSnakeCase(str) {
            return str.replace(/([A-Z])/g, function ($1) {
                return "-" + $1.toLowerCase();
            });
        }

        function createElement() {
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
                var fieldElement = createElement();
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

    .directive('nemoHelpMessages', ['$compile', function ($compile) {
        return {
            scope: {
                fieldName: '@',
                help: '=model'
            },
            template:   '<div class="help-messages">{{help.message}}</div>',
            link: function(scope, element) {
                var dynamicContentId = scope.help.code.replace(/\./g, '-'),
                    dynamicContentElement = angular.element('<div></div>');

                dynamicContentElement.attr(dynamicContentId, true);
                dynamicContentElement.attr('field-name', '{{fieldName}}');
                dynamicContentElement.attr('help', 'help');
                element.append(dynamicContentElement);
                $compile(dynamicContentElement)(scope);
            }
        }
    }]);

'use strict';

angular.module('nemo')

    .directive('nemoIcon', [function () {
        return {
            template:'<div class="field-icon field-icon_{{type}}" ' +
                        'data-ng-mouseover="onHover(fieldName)" ' +
                        'data-ng-mouseleave="onBlur(fieldName)" ' +
                        'data-ng-if="type">' +
                        '{{getText(type)}}' +
                    '</div>',
            replace: true,
            scope: {
                fieldName: '@',
                type: '@',
                onHover: '&',
                onBlur: '&'
            },
            link: function (scope) {
                scope.getText = function (type) {
                    var iconText;
                    switch (type) {
                        case 'error':
                            iconText = '!';
                            break;
                        case 'help':
                            iconText = '?';
                            break;
                    }
                    return iconText;
                };
            }
        }
    }]);
'use strict';
angular.module('nemo')

    .directive('nemoValidationMessages', ['nemoMessages', function (messages) {
        return {
            scope: {
                validation: '=model'
            },
            template:   '<div data-t-validation-code="{{validationCode}}" class="validation-messages">' +
                            '{{getValidationMessage()}}' +
                        '</div>',
            link: function(scope) {

                scope.getValidationMessage = function() {
                    for(var validationId in scope.validation.$error) {
                        if(scope.validation.$error.hasOwnProperty(validationId)) {
                            scope.validationCode = validationId;
                            return messages.get(validationId);
                        }
                    }
                };
            }
        }
    }]);