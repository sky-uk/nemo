'use strict';

angular.module('nemo')

    .provider('input', ['$compileProvider', function ($compileProvider) {

        function capitaliseFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function input(type, options) {
            var parentTemplateElement = angular.element('<div>' + options.template + '</div>'),
                templateElement = parentTemplateElement.find(' > *');
            templateElement.attr('ng-model', 'field.value');

            //<input /> --> <input ng-model=field.value />
            //<div><div></div><div>

            $compileProvider.directive
                .apply(null, [ 'input' + capitaliseFirstLetter(type), ['$compile', '$http', function ($compile, $http) {
                    return {
                        require: ['ngModel', '^form', '^formHandler'],
                        template: parentTemplateElement.html(),
                        replace: true,
                        restrict: 'A',
                        link: function (scope, element, attrs, controllers) {
                            var formHandlerController = controllers[2];
                            if (options.linkFn) {
                                options.linkFn(scope, element, attrs, formHandlerController, $compile, $http)
                            }
                        }
                    }
                }]]);

            return this;
        }

        return {
            input: input,
            $get: {}
        }
    }]);