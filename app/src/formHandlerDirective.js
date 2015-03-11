'use strict';

angular.module('nemo')

    .controller('nemoFormHandlerCtrl', ['$scope', '$attrs', function ($scope, $attrs) {

        var registerFieldsFns = {};

        if (!$attrs.name) {
            angular.toThrow();
        }

        this.setFieldValue = function (fieldName, value) {
            if ($scope[$attrs.name][fieldName]) {
                $scope[$attrs.name][fieldName].$setViewValue(value);
            }
        };

        this.getFieldValue = function (fieldName) {
            return $scope[$attrs.name][fieldName] ? $scope[$attrs.name][fieldName].$viewValue : '';
        };

        this.forceValidity = function (fieldName, validationRuleCode, newValidity) {
            registerFieldsFns[fieldName].validityChange(validationRuleCode, newValidity);
        };

        this.setActiveField = function (activeFieldName) {
            for (var currentFieldName in registerFieldsFns) {
                registerFieldsFns[currentFieldName].activeFieldChange(activeFieldName);
            }
        };

        this.registerField = function (fieldName, registerFieldFns) {
            registerFieldsFns[fieldName] = registerFieldFns;
        };
    }])

    .directive('nemoFormHandler', [function () {
        return {
            controller: 'nemoFormHandlerCtrl'
        }
    }]);