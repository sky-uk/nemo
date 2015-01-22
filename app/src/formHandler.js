'use strict';

angular.module('nemo')

    .directive('formHandler', [function () {
        return {
            controller: ['$scope', function ($scope) {

                this.getFieldValue = function(name) {
                    return _.find($scope.action.fields, function(field) {
                        return field.name === name;
                    }).value;
                };

                this.getLink = function(rel) {
                    return _.find($scope.links, function (value) {
                        return _.contains(value.rel, rel);
                    }).href;
                };
            }]
        }
    }]);