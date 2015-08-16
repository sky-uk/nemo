'use strict';

angular.module('nemo')

    .directive('nemoIcon', [function () {
        return {
            template:'<div class="field-icon field-icon_{{type}}" ' +
                        'data-ng-mouseover="onHover({fieldName: fieldName})" ' +
                        'data-ng-mouseleave="onBlur({fieldName: fieldName})" ' +
                        'data-ng-show="type">' +
                        '{{getText(type)}}' +
                    '</div>',
            replace: true,
            scope: {
                fieldName: '@',
                type: '@',
                onHover: '&',
                onBlur: '&'
            },
            link: function (scope) {
                scope.getText = function (type) {
                    var iconText;
                    switch (type) {
                        case 'error':
                            iconText = '!';
                            break;
                        case 'help':
                            iconText = '?';
                            break;
                    }
                    return iconText;
                };
            }
        }
    }]);