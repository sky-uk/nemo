angular.module('nemo', [])

    .config(['nemoInputDirectiveCreatorProvider', 'nemoValidationDirectiveCreatorProvider', 'nemoUtilsProvider', 'captchaProvider',
        function (inputProvider, validationProvider, utilsProvider, captchaProvider) {

            inputProvider

                .input('text', {
                    template: '<input type="text" />'
                })

                .input('select', {
                    template: '<select data-ng-options="option.value as option.text for option in model.options"><option value="">Please select...</option></select>'
                })

                .input('hidden', {
                    template: '<input type="hidden" />'
                })

                .input('password', {
                    template: '<input type="password" />'
                })

                .input('email', {
                    template: '<input type="text" />'
                })

                .input('checkbox', {
                    template: '<input type="checkbox" ng-click="setActiveCheckboxField()" />',
                    linkFn: function(scope, element, attrs, controllers) {
                        scope.setActiveCheckboxField = function () {
                            var ngModelCtrl = controllers[0];
                            ngModelCtrl.$setTouched();
                            scope.setActiveField();
                        }
                    }
                })

                .input('captcha', captchaProvider);

            validationProvider

                .validation('required', {
                    validateFn: function (value, validationRuleValue, formHandlerController, ngModelController) {
                        return (validationRuleValue) ? !ngModelController.$isEmpty(value) : true;
                    }
                })

                .validation('inlist', {
                    validateFn: function (value, validationRuleValue) {
                        return (value) ? utilsProvider.contains(validationRuleValue, value) : true;
                    }
                })

                .validation('pattern', {
                    validateFn: function (value, validationRuleValue) {
                        return (value) ? new RegExp(validationRuleValue).test(value) : true;
                    }
                })

                .validation('notpattern', {
                    validateFn: function (value, validationRuleValue) {
                        return (value) ? !(new RegExp(validationRuleValue).test(value)) : true;
                    }
                })

                .validation('mustnotcontain', {
                    validateFn: function (value, validationRuleValue, formHandlerController) {
                        var targetValue = formHandlerController.getFieldValue(validationRuleValue);
                        return (value && targetValue) ? value.indexOf(targetValue) < 0 : true;
                    }
                })

                .validation('mustmatch', {
                    preCompileFn: function (tElement) {
                        tElement.attr('nemo-no-paste', 'true');
                    },
                    validateFn: function (value, validationRuleValue, formHandlerController) {
                        var targetValue = formHandlerController.getFieldValue(validationRuleValue);
                        return (value) ? value === targetValue : true;
                    }
                })

                .validation('mustmatchcaseinsensitive', {
                    preCompileFn: function (tElement) {
                        tElement.attr('nemo-no-paste', 'true');
                    },
                    validateFn: function (value, validationRuleValue, formHandlerController) {
                        var targetValue = formHandlerController.getFieldValue(validationRuleValue);
                        return (value && targetValue) ? value.toLowerCase() === targetValue.toLowerCase() : true;
                    }
                })

                .validation('minlength', {
                    validateFn: function (value, validationRuleValue) {
                        return (value && validationRuleValue) ? value.length >= validationRuleValue : true;
                    }
                })

                .validation('maxlength', {
                    validateFn: function (value, validationRuleValue) {
                        return (value && validationRuleValue) ? value.length <= validationRuleValue : true;
                    }
                })

                .validation('email', {
                    validateFn: function (value, validationRuleValue) {
                        if (value && validationRuleValue) {
                            return new RegExp(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i).test(value);
                        }
                        return true;
                    }
                })

                .validation('mustbeequal', {
                    validateFn: function (value, validationRuleValue) {
                        return (value || value === false) ? value === validationRuleValue : true;
                    }
                })

                .validation('usernameserver', {})

                .validation('emailserver', {})

                .validation('signupCompleteserver', {})

                .validation('captchaserver', {
                    validationRuleInterfaceFns: function(scope, ngModelCtrl) {
                        return {
                            forceInvalid: function (validationRuleCode) {
                                ngModelCtrl.$setTouched();
                                scope.refreshCaptcha().then(function () {
                                    ngModelCtrl.$setValidity(validationRuleCode, false);
                                });
                            }
                        }
                    }
                });
    }]);