'use strict';

angular.module('nemo')

    .directive('formHandler', ['$timeout', function ($timeout) {
        return {
            controller: ['$scope', '$attrs', function ($scope, $attrs) {

                var self = this;

                this.getFieldValue = function(fieldName) {
                    return $scope[$attrs.name][fieldName].$viewValue;
                };

                this.forceValidity = function (fieldName, validationRuleCode, newValidity) {
                    $scope[$attrs.name][fieldName].$setValidity(validationRuleCode, newValidity);
                };

                this.getLink = function(rel) {
                    return _.find($scope.links, function (value) {
                        return _.contains(value.rel, rel);
                    }).href;
                };

                $scope.$evalAsync(function () {
                    $scope[$attrs.name].forceValidity = self.forceValidity;
                });
            }]
        }
    }]);