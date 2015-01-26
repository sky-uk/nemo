angular.module('nemo', [])

    .config(['inputProvider', 'validationProvider', function (inputProvider, validationProvider) {

        inputProvider

            .input('text', {
                template: '<input type="text" />'
            })

            .input('select', {
                template: '<select data-ng-options="option.value as option.text for option in model.options"></select>'
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
            });

        validationProvider

            .validation('required', {
                validateFn: function (value, validationRule) {
                    return (validationRule) ?
                        value != '' &&  !_.isEmpty(value) && !_.isNull(value) && !_.isUndefined(value)  :
                        true;
                }
            })

            .validation('inlist', {
                validateFn: function (value, validationRule) {
                    return _.find(validationRule, function(validValue) {
                        return value === validValue;
                    });
                }
            })

            .validation('pattern', {
                validateFn: function (value, validationRule) {
                    var regex = new RegExp(validationRule);
                    return value && validationRule && regex.test(value);
                }
            })

//            .validation('notpattern', {
//                validateFn: function (value, validationRule) {
//                    var regex = new RegExp(validationRule);
//                    return value && validationRule && !regex.test(value);
//                }
//            })

            .validation('mustnotcontain', {
                validateFn: function (value, validationRule, formHandlerController) {
                    var targetValue = formHandlerController.getFieldValue(validationRule);
                    return (value && targetValue) ? value.indexOf(targetValue) < 0 : true;
                }
            })

            .validation('mustmatch', {
                validateFn: function (value, validationRule, formHandlerController) {
                    var targetValue = formHandlerController.getFieldValue(validationRule);
                    return (value) ? value === targetValue : true;
                }
            })

            .validation('minlength', {
                validateFn: function (value, validationRule) {
                    return (value && validationRule) ? value.length >= validationRule : true;
                }
            })

            .validation('maxlength', {
                validateFn: function (value, validationRule) {
                    return (value && validationRule) ? value.length <= validationRule : true;
                }
            })

            .validation('email', {
                validateFn: function (value, validationRule) {
                    var regex = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
                    return value && validationRule && regex.test(value);
                }
            })

            .validation('mustbetrue', {
                validateFn: function (value, validationRule) {
                    return value === validationRule;
                }
            });
    }]);