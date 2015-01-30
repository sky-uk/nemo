describe('validation', function () {

    beforeEach(function () {
        module('nemo');
    });

    var validation = TESTDATA.validation;

    [
        {
            validation: validation.mustnotcontain(),
            flows: [
                { viewValue: undefined, fieldValidity: true, validationMessagesText: ''},
                { viewValue: 'fooUsername', fieldValidity: false, validationMessagesText: 'Foo cant contain username' },
                { viewValue: 'foo', fieldValidity: true, validationMessagesText: '' },
                { viewValue: '', fieldValidity: true, validationMessagesText: '' }
            ]
        },
        {
            validation: validation.mustmatch(),
            flows: [
                { viewValue: undefined, fieldValidity: true, validationMessagesText: ''},
                { viewValue: 'fooUsername', fieldValidity: true, validationMessagesText: '' },
                { viewValue: 'foo', fieldValidity: false, validationMessagesText: 'Foo must match username' },
                { viewValue: '', fieldValidity: true, validationMessagesText: '' }
            ]
        }
    ].forEach(function (scenario) {
            var validationScenario = scenario.validation;
        it('must check the cross validity of the field of type password for the validation ' + validationScenario.type, function () {

            var username_model, password_model, formElement, fieldElement, validationMessagesElement;

            given(function () {
                password_model = {
                    type: 'text',
                    name: 'pwd',
                    value: '',
                    validation: [validationScenario]
                };

                username_model = {
                    type: 'text',
                    name: 'username',
                    value: 'fooUsername',
                    validation: []
                };
            });

            when(function () {
                formElement = compileDirective('<form name="bla" form-handler>' +
                '<nemo-input model="field"></nemo-input>' +
                '<nemo-input model="field2"></nemo-input>' +
                '<nemo-validation-messages model="bla[field.name]"></nemo-validation-messages>' +
                '</form>', { $rootScope: { field: password_model, field2: username_model} });
            });

            and(function () {
                fieldElement = angular.element(formElement.children()[0]);
                validationMessagesElement = angular.element(formElement.children()[2]);
            });

            then(function () {
                expect(fieldElement.attr('validation-' + validationScenario.type)).toBe('model.validation[0].rules');
            });

            scenario.flows.forEach(function (flow) {

                when(function () {
                    if (flow.viewValue !== undefined) {
                        fieldElement.controller('ngModel').$setViewValue(flow.viewValue);
                    }
                });

                then(function () {
                    expect(fieldElement.controller('ngModel').$valid).toBe(flow.fieldValidity);
                    expect(formElement.controller('form').$valid).toBe(flow.fieldValidity);
                });


                when(function () {
                    flow.fieldValidityErrorCodes = [validationScenario.rules[0].code];
                });

                and(function () {
                    expect(Object.keys(formElement.controller('form').$error)).toEqual(flow.fieldValidity ? [] : flow.fieldValidityErrorCodes);
                });

                and(function () {
                    expect(validationMessagesElement.children().length).toBe(flow.validationMessagesText ? 1 : 0);
                    expect(validationMessagesElement.text()).toBe(flow.validationMessagesText);
                });
            });
        });
    });
});