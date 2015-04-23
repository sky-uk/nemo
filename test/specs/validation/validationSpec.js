describe('nemo validation messages', function () {

    beforeEach(function () {
        module('nemo');
    });

    var validation = TESTDATA.validation;

    var scenarios = [
        {
            inputType: 'text',
            validationScenarios: [
                {
                    validation: validation.required(),
                    flows: [
                        {viewValue: undefined, fieldValidity: false, validationMessagesText: ''},
                        {viewValue: 'foo', fieldValidity: true, validationMessagesText: ''},
                        {viewValue: '', fieldValidity: false, validationMessagesText: 'Please enter something'}
                    ]
                },
                {
                    validation: validation.minlength(5),
                    flows: [
                        {viewValue: undefined, fieldValidity: true, validationMessagesText: ''},
                        {viewValue: 'foo', fieldValidity: false, validationMessagesText: 'Please type a longer text'},
                        {viewValue: 'fooba', fieldValidity: true, validationMessagesText: ''},
                        {viewValue: '', fieldValidity: true, validationMessagesText: ''}
                    ]
                },
                {
                    validation: validation.maxlength(10),
                    flows: [
                        {viewValue: undefined, fieldValidity: true, validationMessagesText: ''},
                        {
                            viewValue: 'foo bar bla',
                            fieldValidity: false,
                            validationMessagesText: 'Please type a shorter text'
                        },
                        {viewValue: 'foo bar bl', fieldValidity: true, validationMessagesText: ''},
                        {viewValue: '', fieldValidity: true, validationMessagesText: ''}
                    ]
                },
                {
                    validation: validation.email(),
                    flows: [
                        {viewValue: undefined, fieldValidity: true, validationMessagesText: ''},
                        {viewValue: 'foo', fieldValidity: false, validationMessagesText: 'Please enter a valid email'},
                        {viewValue: 'foo@bla.com', fieldValidity: true, validationMessagesText: ''},
                        {viewValue: '', fieldValidity: true, validationMessagesText: ''}
                    ]
                },
                {
                    validation: validation.mustbeequal(),
                    flows: [
                        {viewValue: undefined, fieldValidity: true, validationMessagesText: ''},
                        {viewValue: false, fieldValidity: false, validationMessagesText: 'The value must be true'},
                        {viewValue: true, fieldValidity: true, validationMessagesText: ''},
                        {viewValue: 'foo', fieldValidity: false, validationMessagesText: 'The value must be true'},
                        {viewValue: '', fieldValidity: true, validationMessagesText: ''}
                    ]
                },
                {
                    validation: validation.inlist(),
                    flows: [
                        {viewValue: undefined, fieldValidity: true, validationMessagesText: ''},
                        {
                            viewValue: 'test',
                            fieldValidity: false,
                            validationMessagesText: 'Please select a valid value'
                        },
                        {viewValue: 'foo', fieldValidity: true, validationMessagesText: ''},
                        {viewValue: '', fieldValidity: true, validationMessagesText: ''}
                    ]
                },
                {
                    validation: validation.pattern(),
                    flows: [
                        {viewValue: undefined, fieldValidity: true, validationMessagesText: ''},
                        {
                            viewValue: 'test&foo',
                            fieldValidity: false,
                            validationMessagesText: 'Please type just letters and spaces'
                        },
                        {viewValue: 'foo', fieldValidity: true, validationMessagesText: ''},
                        {
                            viewValue: 'test-',
                            fieldValidity: false,
                            validationMessagesText: 'Please type a letter only at start and end',
                            fieldValidityErrorCodes: ['foo.invalid.characters.startorend']
                        },
                        {viewValue: 'test foo', fieldValidity: true, validationMessagesText: ''},
                        {
                            viewValue: 'test&foo-',
                            fieldValidity: false,
                            validationMessagesText: 'Please type just letters and spaces',
                            fieldValidityErrorCodes: ['foo.invalid.characters', 'foo.invalid.characters.startorend']
                        },
                        {viewValue: '', fieldValidity: true, validationMessagesText: ''}
                    ]
                },
                {
                    validation: validation.notpattern(),
                    flows: [
                        {viewValue: undefined, fieldValidity: true, validationMessagesText: ''},
                        {viewValue: '2', fieldValidity: false, validationMessagesText: 'Please type bigger numbers'},
                        {
                            viewValue: '7',
                            fieldValidity: false,
                            validationMessagesText: 'Please type smaller numbers',
                            fieldValidityErrorCodes: ['foo.invalid.bigNumbers']
                        },
                        {viewValue: '9', fieldValidity: true, validationMessagesText: ''},
                        {
                            viewValue: '5',
                            fieldValidity: false,
                            validationMessagesText: 'Please type bigger numbers',
                            fieldValidityErrorCodes: ['foo.invalid.smallNumbers', 'foo.invalid.bigNumbers']
                        },
                        {viewValue: '', fieldValidity: true, validationMessagesText: ''}
                    ]
                }
            ]
        }
    ];

    scenarios.forEach(function (scenario) {

        scenario.validationScenarios.forEach(function (validationScenario) {

            it('must check the validity of the field of type ' + scenario.inputType + ' for the validation ' + validationScenario.validation.type, function () {

                var model, formElement, fieldElement, validationMessagesElement;

                given(function () {
                    model = {
                        type: scenario.inputType,
                        name: 'foo',
                        value: '',
                        properties: {
                            validation: [validationScenario.validation]
                        }
                    };
                });

                when(function () {
                    formElement = compileDirective('<form name="bla" nemo-form-handler>' +
                    '<nemo-input model="field"></nemo-input>' +
                    '<nemo-validation-messages model="bla[field.name]"></nemo-validation-messages>' +
                    '</form>', {$rootScope: {field: model}});
                });

                and(function () {
                    fieldElement = angular.element(formElement.children()[0]);
                    validationMessagesElement = angular.element(formElement.children()[1]);
                });

                then(function () {
                    expect(fieldElement.attr('validation-' + validationScenario.validation.type)).toBe('model.properties.validation[0].rules');
                });

                validationScenario.flows.forEach(function (flow) {

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
                        if (!flow.fieldValidityErrorCodes) {
                            flow.fieldValidityErrorCodes = [validationScenario.validation.rules[0].code];
                        }
                    });

                    then(function () {
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

    describe('server validation flow', function () {

        it('must inherit the previous validity state for server-related validation rules,' +
        'independently of what happen with other validation rules attached to that field.' +
        'That validity will change just if: 1) it\'s explicitly changed (valid -> invalid). ' +
        '2) the data model changes (invalid -> valid)', function () {

            var model, formElement, fieldElement, ngModelCtrl;

            given(function () {
                model = {
                    type: 'text',
                    name: 'foo',
                    value: '',
                    properties: {
                        validation: [validation.minlength(5), validation.usernameserver()]
                    }
                };
            });

            when(function () {
                formElement = compileDirective('<form name="bla" nemo-form-handler>' +
                '<nemo-input model="field"></nemo-input>' +
                '<nemo-validation-messages model="bla[field.name]"></nemo-validation-messages>' +
                '</form>', {$rootScope: {field: model}});
            });

            and(function () {
                fieldElement = angular.element(formElement.children()[0]);
                ngModelCtrl = fieldElement.controller('ngModel');
            });

            and(function () {
                ngModelCtrl.$setViewValue('bla');
            });

            then(function () {
                expect(ngModelCtrl.$error['foo.size.toosmall']).toBe(true);
                expect(ngModelCtrl.$error['username.taken']).toBeUndefined();
            });

            when(function () {
                formElement.controller('nemoFormHandler').forceInvalid('username.taken');
            });

            then(function () {
                expect(ngModelCtrl.$error['foo.size.toosmall']).toBe(true);
                expect(ngModelCtrl.$error['username.taken']).toBe(true);
            });

            and(function () {
                ngModelCtrl.$setViewValue('bar');
            });

            then(function () {
                expect(ngModelCtrl.$error['foo.size.toosmall']).toBe(true);
                expect(ngModelCtrl.$error['username.taken']).toBeUndefined();
            });
        });
    });
});