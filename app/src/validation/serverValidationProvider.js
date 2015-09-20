angular.module('nemo').provider('serverValidation', function () {
    return {
        linkFn: function (scope, element, attrs, validationInterfaceFns) {

            scope.$watch(function () {
                return validationInterfaceFns.getValue();
            }, function (newVal, oldVal) {
                if (newVal === oldVal) { return; }

                validationInterfaceFns.forceValid();
            });
        },
        $get: {}
    }
});