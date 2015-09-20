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
                templateElement.setAttribute('id', '{{model.id || model.name}}');
                templateElement.setAttribute('placeholder', '{{model.properties.placeholder.message}}');
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

            function manageCustomLinkFn(scope, element, attrs, fieldInterfaceFns, formHandlerCtrl, $injector, linkFn) {
                (linkFn || angular.noop)(scope, element, attrs, fieldInterfaceFns, formHandlerCtrl, fieldInterfaceFns, $injector);
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
                        formHandlerCtrl.trackActiveField(scope.model.name);
                    });
                });
            }

            function getLinkFn(options, $injector) {
                return function (scope, element, attrs, controllers) {
                    var ngModelCtrl = controllers[0],
                        formHandlerCtrl = controllers[1],
                        parentNgModelCtrl = controllers[2];
                    validateFormOnFieldChange(scope, ngModelCtrl, formHandlerCtrl);

                    var fieldInterfaceFns = getFieldInterfaceFns(scope, element, ngModelCtrl, formHandlerCtrl),
                        interfaceFuns = registerField(scope, element, ngModelCtrl, formHandlerCtrl, fieldInterfaceFns, options.fieldInterfaceFns);
                    interfaceFuns.setupBusinessRules();

                    manageCustomLinkFn(scope, element, attrs, fieldInterfaceFns, formHandlerCtrl, $injector, (options.link || options.linkFn));
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

            function registerField(scope, element, ngModelCtrl, formHandlerCtrl, fieldInterfaceFns, customFieldInterfaceFns) {
                var customerFieldInterface = customFieldInterfaceFns ? customFieldInterfaceFns(scope, element, ngModelCtrl, formHandlerCtrl) : {};
                angular.extend(fieldInterfaceFns, customerFieldInterface);
                formHandlerCtrl.registerField(scope.model.name, fieldInterfaceFns);
                return fieldInterfaceFns;
            }

            function getFieldInterfaceFns(scope, element, ngModelCtrl, formHandlerCtrl) {
                return {
                    activeFieldChange: function (activeField) {
                        ngModelCtrl.isActive = isFieldNowActive(scope.model.name, activeField);
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

            function getDirectiveDefinitionObject(options, $injector) {
                return {
                    require: ['ngModel', '^nemoFormHandler', '?^^ngModel'],
                    template: getTemplateWithAttributes(options.template),
                    replace: true,
                    restrict: 'A',
                    link: getLinkFn(options, $injector),
                    controller: options.controller
                };
            }

            function input(type, options) {
                $compileProvider.directive
                    .apply(null, [
                        'input' + utilsProvider.capitalise(type),
                        ['$injector', function ($injector) {
                            return getDirectiveDefinitionObject(options, $injector);
                        }]]);
                return this;
            }

            return {
                input: input,
                $get: angular.noop
            };
        }
    ]);
