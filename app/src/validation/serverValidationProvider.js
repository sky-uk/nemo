angular.module('nemo').provider('serverValidation', function () {
    return {
        linkFn: function (scope, element, attrs, controllers, validFns) {
            var ngModelCtrl = controllers[0];

            scope.$watch(function () {
                return ngModelCtrl.$viewValue;
            }, function (newVal, oldVal) {
                if (newVal === oldVal) { return; }

                validFns.forceValid();
            });
        },
        $get: {}
    }
});