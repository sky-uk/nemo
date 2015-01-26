'use strict';

angular.module('nemo')

    .provider('input', ['$compileProvider', function ($compileProvider) {

        function capitaliseFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function getTemplateWithAttributes(template) {
            var parentTemplateElement, templateElement;
            parentTemplateElement = document.createElement('div');
            parentTemplateElement.innerHTML = template;
            templateElement = parentTemplateElement.firstChild;
            templateElement.setAttribute('ng-model', 'model.value');
            templateElement.setAttribute('name', '{{model.name}}');
            return parentTemplateElement.innerHTML;
        }

        function getLinkFn(options, $compile, $http) {
            return function (scope, element, attrs, controllers) {
                var formHandlerController = controllers[2];
                if (options.linkFn) {
                    options.linkFn(scope, element, attrs, formHandlerController, $compile, $http);
                }
            }
        }

        function getDDO(options, $compile, $http) {
            return {
                require: ['ngModel', '^form', '^formHandler'],
                template: getTemplateWithAttributes(options.template),
                replace: true,
                restrict: 'A',
                link: getLinkFn(options, $compile, $http)
            }
        }

        function input(type, options) {
            $compileProvider.directive
                .apply(null, [
                    'input' + capitaliseFirstLetter(type),
                    ['$compile', '$http', function ($compile, $http) {
                        return getDDO(options, $compile, $http);
                }]]);
            return this;
        }

        return {
            input: input,
            $get: angular.noop
        }
    }]);