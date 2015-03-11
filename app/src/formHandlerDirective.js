'use strict';

angular.module('nemo')

    .directive('nemoFormHandler', [function () {
        return {
            require: 'form',
            controller: ['$scope', '$attrs', function ($scope, $attrs) {

                var self = this, registerActiveFieldChangeFns = [];

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

                this.setActiveField = function (fieldName) {
                    angular.forEach(registerActiveFieldChangeFns, function (registerActiveFieldChangeFn) {
                        registerActiveFieldChangeFn(fieldName);
                    });
                };

                this.registerActiveFieldChange = function (registerActiveFieldChangeFn) {
                    registerActiveFieldChangeFns.push(registerActiveFieldChangeFn);
                };

                $scope.$evalAsync(function () {
                    $scope[$attrs.name].forceValidity = self.forceValidity;
                });
            }]
        }
    }]);