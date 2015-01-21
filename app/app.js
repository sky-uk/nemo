angular.module('nemo', [])

    .config(['inputProvider', function (inputProvider) {

        inputProvider

            .input('text', {
                template: '<input type="text" />'
            })

            .input('select', {
                template: '<select ng-options="option.value as option.text for option in field.options"></select>'
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