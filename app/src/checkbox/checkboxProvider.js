angular.module('nemo').provider('checkbox', [function () {
    return {
        template: '<input type="checkbox" ng-click="setActiveCheckboxField()" />',
        defaultValue: false,
        linkFn: function (scope, element, attrs, controllers) {
            var ngModelCtrl = controllers[0],
                formHandlerCtrl = controllers[1],
                fieldValue = scope.model.value;
            formHandlerCtrl.setFieldValue(scope.model.name, fieldValue === true || fieldValue === 'true');
            scope.setActiveCheckboxField = function () {
                ngModelCtrl.$setTouched();
                scope.setActiveField();
            }
        },
        $get: angular.noop
    }
}]);