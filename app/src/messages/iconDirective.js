angular.module('nemo')

    .directive('nemoIcon', ['$sce', function ($sce) {
        return {
            template:'<div class="field-icon field-icon_{{type}}" ' +
                        'data-ng-mouseover="onHover(fieldName)" ' +
                        'data-ng-mouseleave="onBlur(fieldName)" ' +
                        'data-ng-show="type" ng-bind-html="getText(type)">' +
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
                    var iconText = ' ';
                    switch (type) {
                        case 'valid':
                            iconText = '&#10004;';
                            break;
                        case 'error':
                            iconText = '!';
                            break;
                        case 'help':
                            iconText = '?';
                            break;
                    }
                    return $sce.trustAsHtml(iconText);
                };
            }
        };
    }]);