angular.module('nemo', [])

    .config(['nemoInputDirectiveCreatorProvider', 'nemoValidationDirectiveCreatorProvider', 'nemoUtilsProvider', 'captchaProvider', 'checkboxProvider', 'serverValidationProvider',
        function (inputProvider, validationProvider, utilsProvider, captchaProvider, checkboxProvider, serverValidation) {

            inputProvider

                .input('text', {
                    template: '<input type="text" />',
                    defaultValue: ''
                })

                .input('select', {
                    template: '<select data-ng-options="option.value as option.text for option in model.options"><option value="">Please select...</option></select>',
                    defaultValue: ''
                })

                .input('hidden', {
                    template: '<input type="hidden" ng-value="model.value" />',
                    defaultValue: ''
                })

                .input('password', {
                    template: '<input type="password" />',
                    defaultValue: ''
                })

                .input('email', {
                    template: '<input type="text" />',
                    defaultValue: ''
                })

                .input('checkbox', checkboxProvider)

                .input('captcha', captchaProvider);

            validationProvider

                .validation('required', {
                    validateFn: function (value, validationRule, validationInterfaceFns, formHandlerController) {
                        return (validationRule.value) ? !validationInterfaceFns.isEmpty(value) : true;
                    }
                })

                .validation('inList', {
                    validateFn: function (value, validationRule) {
                        return (value) ? utilsProvider.contains(validationRule.value, value) : true;
                    }
                })

                .validation('pattern', {
                    validateFn: function (value, validationRule) {
                        return (value) ? new RegExp(validationRule.value).test(value) : true;
                    }
                })

                .validation('notPattern', {
                    validateFn: function (value, validationRule) {
                        return (value) ? !(new RegExp(validationRule.value).test(value)) : true;
                    }
                })

                .validation('mustNotContain', {
                    validateFn: function (value, validationRule, validationInterfaceFns, formHandlerController) {
                        var targetValue = formHandlerController.getFieldValue(validationRule.value, true);
                        return (value && targetValue) ? value.toLowerCase().indexOf(targetValue.toLowerCase()) < 0 : true;
                    }
                })

                .validation('mustMatch', {
                    validateFn: function (value, validationRule, validationInterfaceFns, formHandlerController) {
                        var targetValue = formHandlerController.getFieldValue(validationRule.value, true);
                        return (value) ? value === targetValue : true;
                    }
                })

                .validation('mustMatchCaseInsensitive', {
                    validateFn: function (value, validationRule, validationInterfaceFns, formHandlerController) {
                        var targetValue = formHandlerController.getFieldValue(validationRule.value, true);
                        return (value && targetValue) ? value.toLowerCase() === targetValue.toLowerCase() : true;
                    }
                })

                .validation('minLength', {
                    validateFn: function (value, validationRule) {
                        return (value && validationRule) ? value.length >= validationRule.value : true;
                    }
                })

                .validation('maxLength', {
                    validateFn: function (value, validationRule) {
                        return (value && validationRule) ? value.length <= validationRule.value : true;
                    }
                })

                .validation('email', {
                    validateFn: function (value, validationRule) {
                        if (value && validationRule.value) {
                            return new RegExp(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i).test(value);
                        }
                        return true;
                    }
                })

                .validation('mustBeEqual', {
                    validateFn: function (value, validationRule) {
                        return (value || value === false) ? value === validationRule.value : true;
                    }
                })

                .validation('dependentPattern', {
                    validateFn: function (value, validationRule, validationInterfaceFns, formHandlerController) {
                        var otherFieldValue = formHandlerController.getFieldValue(validationRule.value, true),
                            regex = validationRule.patterns[otherFieldValue];
                        return (value) ? new RegExp(regex, 'i').test(value) : true;
                    }
                })

                .validation('dependentRequired', {
                    validateFn: function (value, validationRule, validationInterfaceFns, formHandlerController) {
                        var otherFieldValue = formHandlerController.getFieldValue(validationRule.value, true),
                            required = utilsProvider.contains(validationRule.when, otherFieldValue);

                        return required ? !validationInterfaceFns.isEmpty(value) : true;
                    }
                })

                .validation('server', serverValidation);
    }]);