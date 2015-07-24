angular.module('nemo')
    .directive('nemoHelpMessage', ['$compile', function ($compile) {
        return {
            scope: {
                fieldName: '@',
                help: '=model'
            },
            replace: true,
            template:   '<div class="field-help">{{help.message}}</div>',
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
    }]);
