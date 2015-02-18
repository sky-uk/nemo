'use strict';

angular.module('nemo')

    .provider('input', ['$compileProvider', 'utilsProvider', function ($compileProvider, utilsProvider) {

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
                if (options.linkFn) {
                    options.linkFn(scope, element, attrs, controllers, $compile, $http);
                }
            }
        }

        function getDirectiveDefinitionObject(options, $compile, $http) {
            return {
                require: ['ngModel', '^formHandler'],
                template: getTemplateWithAttributes(options.template),
                replace: true,
                restrict: 'A',
                link: getLinkFn(options, $compile, $http),
                controller: options.controller
            }
        }

        function input(type, options) {
            $compileProvider.directive
                .apply(null, [
                    'input' + utilsProvider.capitalise(type),
                    ['$compile', '$http', function ($compile, $http) {
                        return getDirectiveDefinitionObject(options, $compile, $http);
                }]]);
            return this;
        }

        return {
            input: input,
            $get: angular.noop
        }
    }]);
