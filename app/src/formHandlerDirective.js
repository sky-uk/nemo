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

        this.forceInvalid = function (validationRuleCode) {
            getRegisteredValidationRule(validationRuleCode).forceInvalid(validationRuleCode);
        };

        this.forceAllFieldsToBeDirty = function () {
            angular.forEach(registeredFieldsFns, function (fieldInterfaceFns) {
                fieldInterfaceFns.forceDirty();
            });
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
            controller: 'nemoFormHandlerCtrl'
        }
    }]);