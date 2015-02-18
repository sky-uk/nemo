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