angular.module('nemo').provider('checkbox', [function () {
    return {
        template: '<div data-ng-click="toggle()" data-ng-keyup="toggleIfEnter($event)" data-ng-class="{checked: isChecked(), focused: isFocused()}">' +
        '<label class="tick" data-ng-show="isChecked()">\u2714</label>' +
        '<input type="text" data-ng-focus="setFocus()" data-ng-blur="releaseFocus()" ' +
            'style="position: absolute; top: 0; left: 0; width: 0; height: 0; opacity: 0; cursor: pointer; font-size: 0; color: transparent; text-indent: 100%; padding: 0; border: none;" />' +
        '</div>',
        defaultValue: false,
        linkFn: function (scope, element, attrs, formHandlerCtrl, validationInterfaceFns) {

            var fieldValue = scope.model.value,
                fieldName = scope.model.name,
                hasGenuineFocus = false;

            setValue(fieldValue === true || fieldValue === 'true');

            scope.isFocused = function () {
                return hasGenuineFocus && validationInterfaceFns.isActive;
            };

            scope.isChecked = function () {
                return formHandlerCtrl.getFieldValue(fieldName);
            };

            scope.toggle = function () {
                setValue(!scope.isChecked());
                scope.setFocus();
                formHandlerCtrl.setFieldDirtyTouched(fieldName);
            };

            scope.toggleIfEnter = function ($event) {
                var spaceKeyCode = 32;
                if ($event.which === spaceKeyCode) {
                    scope.toggle();
                }
            };

            scope.setFocus = function () {
                hasGenuineFocus = true;
                setActiveState();
            };

            scope.releaseFocus = function () {
                hasGenuineFocus = false;
                formHandlerCtrl.setFieldDirtyTouched(fieldName);
            };

            function setValue(value) {
                formHandlerCtrl.setFieldValue(fieldName, value);
            }

            function setActiveState() {
                formHandlerCtrl.setActiveField(fieldName);
            }
        },
        $get: angular.noop
    }
}]);