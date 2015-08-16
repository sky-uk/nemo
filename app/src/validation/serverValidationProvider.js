angular.module('nemo').provider('serverValidation', function () {
    return {
        linkFn: function (scope, element, attrs, formHandlerCtrl, ngModelCtrl, validFns) {

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