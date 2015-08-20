'use strict';
angular.module('nemo')

    .directive('nemoHelpMessages', ['$compile', function ($compile) {
        return {
            scope: {
                fieldName: '@',
                help: '=model'
            },
            template:   '<div class="help-messages">{{help.message}}</div>',
            link: function(scope, element) {
                var dynamicContentId = scope.help.code.replace(/\./g, '-'),
                    dynamicContentElement = angular.element('<div></div>');

                dynamicContentElement.attr(dynamicContentId, true);
                dynamicContentElement.attr('field-name', '{{fieldName}}');
                dynamicContentElement.attr('help', 'help');
                angular.element(element.children()[0]).append(dynamicContentElement);
                $compile(dynamicContentElement)(scope);
            }
        }
    }]);
