'use strict';
angular.module('nemo')

    .directive('nemoValidationMessages', ['nemoMessages', function (messages) {
        return {
            scope: {
                model: '='
            },
            template:   '<div data-ng-if="(model.$dirty || model.$touched) && model.$invalid" data-t-validation-code="{{validationCode}}" class="field-error">' +
                            '[ERROR] {{getValidationMessage()}}' +
                        '</div>',
            link: function(scope) {

                scope.getValidationMessage = function() {
                    for(var validationId in scope.model.$error) {
                        if(scope.model.$error.hasOwnProperty(validationId)) {
                            scope.validationCode = validationId;
                            return messages.get(validationId);
                        }
                    }
                };
            }
        }
    }])

    .directive('nemoHelpMessages', ['$compile', function ($compile) {
        return {
            scope: {
                fieldName: '@',
                help: '=model'
            },
            template:   '<div class="field-help">[HELP] {{help.message}}</div>',
            link: function(scope, element) {
                var dynamicContentId = scope.help.code.replace(/\./g, '-'),
                    dynamicContentElement = angular.element('<div></div>');
                    dynamicContentElement.attr(dynamicContentId, true);
                    dynamicContentElement.attr('field-name', '{{fieldName}}');
                    dynamicContentElement.attr('help', 'help');
                    element.append(dynamicContentElement);
                    $compile(dynamicContentElement)(scope);
            }
        }
    }])

    .directive('passwordHelp', ['$sce', function ($sce) {
        return {
            scope: {
                fieldName: '@',
                help: '='
            },
            require: '^nemoFormHandler',
            template: '<div ng-bind-html="getMessage()"></div>',
            link: function (scope, element, attributes, formHandlerCtrl) {
                scope.getMessage = function () {
                    var markup =
                        '<ul>'
                            + '<li>Field name:' + scope.fieldName + '</li>'
                            + '<li>Field value:' + formHandlerCtrl.getFieldValue(scope.fieldName) + '</li>'
                            + '<li>Default error message:' + scope.help.message + '</li>'
                        + '</ul>';
                    return $sce.trustAsHtml(markup);
                }
            }
        };
    }]);