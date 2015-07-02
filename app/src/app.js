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
                    validateFn: function (value, validationRule, formHandlerController, ngModelController) {
                        return (validationRule.value) ? !ngModelController.$isEmpty(value) : true;
                    }
                })

                .validation('inlist', {
                    validateFn: function (value, validationRule) {
                        return (value) ? utilsProvider.contains(validationRule.value, value) : true;
                    }
                })

                .validation('pattern', {
                    validateFn: function (value, validationRule) {
                        return (value) ? new RegExp(validationRule.value).test(value) : true;
                    }
                })

                .validation('notpattern', {
                    validateFn: function (value, validationRule) {
                        return (value) ? !(new RegExp(validationRule.value).test(value)) : true;
                    }
                })

                .validation('mustnotcontain', {
                    validateFn: function (value, validationRule, formHandlerController) {
                        var targetValue = formHandlerController.getFieldValue(validationRule.value, true);
                        return (value && targetValue) ? value.toLowerCase().indexOf(targetValue.toLowerCase()) < 0 : true;
                    }
                })

                .validation('mustmatch', {
                    validateFn: function (value, validationRule, formHandlerController) {
                        var targetValue = formHandlerController.getFieldValue(validationRule.value, true);
                        return (value) ? value === targetValue : true;
                    }
                })

                .validation('mustmatchcaseinsensitive', {
                    validateFn: function (value, validationRule, formHandlerController) {
                        var targetValue = formHandlerController.getFieldValue(validationRule.value, true);
                        return (value && targetValue) ? value.toLowerCase() === targetValue.toLowerCase() : true;
                    }
                })

                .validation('minlength', {
                    validateFn: function (value, validationRule) {
                        return (value && validationRule) ? value.length >= validationRule.value : true;
                    }
                })

                .validation('maxlength', {
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

                .validation('mustbeequal', {
                    validateFn: function (value, validationRule) {
                        return (value || value === false) ? value === validationRule.value : true;
                    }
                })

                .validation('dependentpattern', {
                    validateFn: function (value, validationRule, formHandlerController) {
                        var otherFieldValue = formHandlerController.getFieldValue(validationRule.value, true),
                            regex = validationRule.patterns[otherFieldValue];
                        return (value) ? new RegExp(regex, 'i').test(value) : true;
                    }
                })

                .validation('dependentrequired', {
                    validateFn: function (value, validationRule, formHandlerController, ngModelController) {
                        var otherFieldValue = formHandlerController.getFieldValue(validationRule.value, true),
                            required = utilsProvider.contains(validationRule.when, otherFieldValue);

                        return required ? !ngModelController.$isEmpty(value) : true;
                    }
                })

                .validation('usernameserver', serverValidation)

                .validation('emailserver', serverValidation)

                .validation('transactionCompleteserver', {})

                .validation('captchaserver', angular.extend({}, {
                    validationRuleInterfaceFns: function(scope, ngModelCtrl) {
                        return {
                            forceInvalid: function (validationRuleCode) {
                                scope.refreshCaptcha().then(function () {
                                    ngModelCtrl.$setValidity(validationRuleCode, false);
                                });
                            }
                        };
                    }
                }, serverValidation));
    }]);