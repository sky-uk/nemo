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
                angular.element($element).find('input.ng-invalid,select.ng-invalid').first().focus()
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