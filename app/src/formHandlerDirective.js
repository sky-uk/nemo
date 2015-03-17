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