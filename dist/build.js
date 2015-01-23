angular.module('nemo', [])

    .config(['inputProvider', function (inputProvider) {

        inputProvider

            .input('text', {
                template: '<input type="text" />'
            })

            .input('select', {
                template: '<select data-ng-options="option.value as option.text for option in model.options"></select>'
            })

            .input('hidden', {
                template: '<input type="hidden" />'
            })

            .input('password', {
                template: '<input type="password" />'
            })

            .input('email', {
                template: '<input type="email" />'
            })

            .input('checkbox', {
                template: '<input type="checkbox" />'
            })
    }]);
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
'use strict';

angular.module('nemo')

    .provider('input', ['$compileProvider', function ($compileProvider) {

        function capitaliseFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function getTemplateWithNgModel(template) {
            var parentTemplateElement, templateElement;
            parentTemplateElement = document.createElement('div');
            parentTemplateElement.innerHTML = template;
            templateElement = parentTemplateElement.firstChild;
            templateElement.setAttribute('ng-model', 'model.value');
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
                template: getTemplateWithNgModel(options.template),
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
'use strict';

angular.module('nemo')

    .directive('nemo', ['$compile', function ($compile) {

        function toSnakeCase(str) {
            return str.replace(/([A-Z])/g, function ($1) {
                return "-" + $1.toLowerCase();
            });
        }

        function creatElement() {
            return angular.element('<div></div>');
        }

        function addInputAttributeToElement(type, element) {
            element.attr('input-' + toSnakeCase(type), '');
        }

        function addValidationAttributesToElement(validationList, element) {
            if(validationList && validationList.length) {
                validationList.forEach(function (validation, $index) {
                    element.attr('validation-' + toSnakeCase(validation.type), 'model.validation[' + $index + ']')
                });
            }
        }

        return {
            transclude: 'element',
            restrict: 'E',
            scope: {
                model: '='
            },
            link: function (scope, element) {
                var fieldElement = creatElement();
                addInputAttributeToElement(scope.model.type, fieldElement);
                addValidationAttributesToElement(scope.model.validation, fieldElement);
                element.replaceWith(fieldElement);
                $compile(fieldElement)(scope);
            }
        }
    }]);