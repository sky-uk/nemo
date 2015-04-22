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
                { viewValue: 'foousername', fieldValidity: false, validationMessagesText: 'Foo cant contain username' },
                { viewValue: 'foo', fieldValidity: true, validationMessagesText: '' },
                { viewValue: '', fieldValidity: true, validationMessagesText: '' }
            ]
        },
        {
            validation: validation.mustmatch(),
            flows: [
                { viewValue: undefined, fieldValidity: true, validationMessagesText: ''},
                { viewValue: 'fooUsername', fieldValidity: true, validationMessagesText: ''},
                { viewValue: 'foo', fieldValidity: false, validationMessagesText: 'Foo must match username'},
                { viewValue: '', fieldValidity: true, validationMessagesText: ''}
            ]
        },
        {
            validation: validation.mustmatchcaseinsensitive(),
            flows: [
                { viewValue: 'fooUsername', fieldValidity: true, validationMessagesText: ''},
                { viewValue: 'foousername', fieldValidity: true, validationMessagesText: ''},
                { viewValue: 'foo', fieldValidity: false, validationMessagesText: 'Foo must match username'},
                { viewValue: undefined, fieldValidity: true, validationMessagesText: ''},
                { viewValue: '', fieldValidity: true, validationMessagesText: ''}
            ]
        },
        {
            validation: validation.dependentpattern(),
            flows: [
                { viewValue: undefined, fieldValidity: true, validationMessagesText: ''},
                { viewValue: '1', fieldValidity: true, validationMessagesText: ''},
                { viewValue: 'foo', fieldValidity: false, validationMessagesText: 'Foo is not valid'},
                { viewValue: '', fieldValidity: true, validationMessagesText: ''},
                { viewValue: 'a', fieldValidity: true, validationMessagesText: '', otherFieldValue: 'bob'},
                { viewValue: '345', fieldValidity: false, validationMessagesText: 'Foo is not valid', otherFieldValue: 'bob'},
                { viewValue: 'add', fieldValidity: true, validationMessagesText: '', otherFieldValue: 'fred'}
            ]
        },
        {
            validation: validation.dependentrequired(),
            flows: [
                { viewValue: undefined, fieldValidity: false, validationMessagesText: ''},
                { viewValue: 'foo', fieldValidity: true, validationMessagesText: ''},
                { viewValue: '', fieldValidity: false, validationMessagesText: 'Foo is required'},
                { viewValue: undefined, fieldValidity: true, validationMessagesText: '', otherFieldValue: 'dave'}
            ]
        }
    ].forEach(function (scenario) {
            var validationScenario = scenario.validation;
        it('must check the cross validity of the field of type password for the validation ' + validationScenario.type, function () {
            var username_model, password_model, formElement, firstFieldElement, validationMessagesElement, secondFieldElement;

            given(function () {
                password_model = {
                    type: 'text',
                    name: 'pwd',
                    value: '',
                    properties: {
                        validation: [validationScenario]
                    }
                };

                username_model = {
                    type: 'text',
                    name: 'username',
                    value: 'fooUsername',
                    properties: {
                        validation: []
                    }
                };
            });

            scenario.flows.forEach(function (flow) {

                when(function () {
                    formElement = compileDirective('<form name="bla" nemo-form-handler>' +
                    '<nemo-input model="field"></nemo-input>' +
                    '<nemo-input model="field2"></nemo-input>' +
                    '<nemo-validation-messages model="bla[field.name]"></nemo-validation-messages>' +
                    '</form>', { $rootScope: { field: password_model, field2: username_model} });
                });

                and(function () {
                    firstFieldElement = angular.element(formElement.children()[0]);
                    secondFieldElement = angular.element(formElement.children()[1]);
                    validationMessagesElement = angular.element(formElement.children()[2]);
                });

                then(function () {
                    expect(firstFieldElement.attr('validation-' + validationScenario.type)).toBe('model.properties.validation[0].rules');
                });

                when(function () {
                    if (flow.otherFieldValue !== undefined) {
                        secondFieldElement.controller('ngModel').$setViewValue(flow.otherFieldValue);
                    }
                    if (flow.viewValue !== undefined) {
                        firstFieldElement.controller('ngModel').$setViewValue(flow.viewValue);
                    }

                    formElement.controller('nemoFormHandler').validateForm();
                    firstFieldElement.scope().$digest();
                });

                then(function () {
                    expect(firstFieldElement.controller('ngModel').$valid).toBe(flow.fieldValidity);
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