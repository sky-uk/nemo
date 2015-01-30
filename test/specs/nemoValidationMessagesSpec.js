describe('nemo validation messages', function () {

    beforeEach(function () {
        module('nemo');
    });

    var validation = {
        required: function () {
            return {
                "type": "required",
                "rules": [
                    {
                        "value": true,
                        "code": "foo.blank",
                        "message": "Please enter something"
                    }
                ]
            };
        },
        minlength: function (minLength) {
            return {
                "type": "minlength",
                "rules": [
                    {
                        "value": minLength,
                        "code": "foo.size.toosmall",
                        "message": "Please type a longer text"
                    }
                ]
            };
        },
        maxlength: function (maxLength) {
            return {
                "type": "maxlength",
                "rules": [
                    {
                        "value": maxLength,
                        "code": "foo.size.toobig",
                        "message": "Please type a shorter text"
                    }
                ]
            };
        },
        email: function () {
            return {
                "type" : "email",
                "rules" :
                    [
                        {
                            "value" : true,
                            "code" : "foo.email.invalid",
                            "message" : "Please enter a valid email"
                        }
                    ]
            };
        },
        mustbetrue: function () {
            return {
                "type" : "mustbetrue",
                "rules" :
                    [
                        {
                            "value" : true,
                            "code" : "foo.notequal",
                            "message" : "The value must be true"
                        }
                    ]
            };
        },
        inlist: function () {
            return {
                "type" : "inlist",
                "rules" :
                    [
                        {
                            "value" :
                                [
                                    "foo",
                                    "bar",
                                    "bla"
                                ],
                            "code" : "foo.invalid",
                            "message" : "Please select a valid value"
                        }
                    ]
            }
        },
        pattern: function () {
            return {
                "type" : "pattern",
                "rules" :
                    [
                        {
                            "value" : "^[a-zA-Z \\'-]+$",
                            "code" : "foo.invalid.characters",
                            "message" : "Please type just letters and spaces"
                        },
                        {
                            "value" : "[^-\\']$",
                            "code" : "foo.invalid.characters.startorend",
                            "message" : "Please type a letter only at start and end"
                        }
                    ]
            }
        },
        notpattern: function () {
            return {
                "type" : "notpattern",
                "rules" :
                    [
                        {
                            "value" : "^[0-5]*$",
                            "code" : "foo.invalid.smallNumbers",
                            "message" : "Please type bigger numbers"
                        },
                        {
                            "value" : "^[5-8]*$",
                            "code" : "foo.invalid.bigNumbers",
                            "message" : "Please type smaller numbers"
                        }
                    ]
            }
        }
    };

    var scenarios = [
        {
            inputType: 'text',
            validationScenarios: [
                {
                    validation: validation.required(),
                    flows: [
                        { viewValue: undefined, fieldValidity: false, validationMessagesText: ''},
                        { viewValue: 'foo', fieldValidity: true, validationMessagesText: '' },
                        { viewValue: '', fieldValidity: false, validationMessagesText: 'Please enter something' }
                    ]
                },
                {
                    validation: validation.minlength(5),
                    flows: [
                        { viewValue: undefined, fieldValidity: true, validationMessagesText: ''},
                        { viewValue: 'foo', fieldValidity: false, validationMessagesText: 'Please type a longer text' },
                        { viewValue: 'fooba', fieldValidity: true, validationMessagesText: '' },
                        { viewValue: '', fieldValidity: true, validationMessagesText: '' }
                    ]
                },
                {
                    validation: validation.maxlength(10),
                    flows: [
                        { viewValue: undefined, fieldValidity: true, validationMessagesText: ''},
                        { viewValue: 'foo bar bla', fieldValidity: false, validationMessagesText: 'Please type a shorter text' },
                        { viewValue: 'foo bar bl', fieldValidity: true, validationMessagesText: '' },
                        { viewValue: '', fieldValidity: true, validationMessagesText: '' }
                    ]
                },
                {
                    validation: validation.email(),
                    flows: [
                        { viewValue: undefined, fieldValidity: true, validationMessagesText: ''},
                        { viewValue: 'foo', fieldValidity: false, validationMessagesText: 'Please enter a valid email' },
                        { viewValue: 'foo@bla.com', fieldValidity: true, validationMessagesText: '' },
                        { viewValue: '', fieldValidity: true, validationMessagesText: '' }
                    ]
                },
                {
                    validation: validation.mustbetrue(),
                    flows: [
                        { viewValue: undefined, fieldValidity: true, validationMessagesText: ''},
                        { viewValue: false, fieldValidity: false, validationMessagesText: 'The value must be true' },
                        { viewValue: true, fieldValidity: true, validationMessagesText: '' },
                        { viewValue: 'foo', fieldValidity: false, validationMessagesText: 'The value must be true' },
                        { viewValue: '', fieldValidity: true, validationMessagesText: '' }
                    ]
                },
                {
                    validation: validation.inlist(),
                    flows: [
                        { viewValue: undefined, fieldValidity: true, validationMessagesText: ''},
                        { viewValue: 'test', fieldValidity: false, validationMessagesText: 'Please select a valid value' },
                        { viewValue: 'foo', fieldValidity: true, validationMessagesText: '' },
                        { viewValue: '', fieldValidity: true, validationMessagesText: '' }
                    ]
                },
                {
                    validation: validation.pattern(),
                    flows: [
                        { viewValue: undefined, fieldValidity: true, validationMessagesText: ''},
                        { viewValue: 'test&foo', fieldValidity: false, validationMessagesText: 'Please type just letters and spaces' },
                        { viewValue: 'foo', fieldValidity: true, validationMessagesText: '' },
                        { viewValue: 'test-', fieldValidity: false, validationMessagesText: 'Please type a letter only at start and end', fieldValidityErrorCodes: ['foo.invalid.characters.startorend'] },
                        { viewValue: 'test foo', fieldValidity: true, validationMessagesText: '' },
                        { viewValue: 'test&foo-', fieldValidity: false, validationMessagesText: 'Please type just letters and spaces', fieldValidityErrorCodes: ['foo.invalid.characters', 'foo.invalid.characters.startorend'] },
                        { viewValue: '', fieldValidity: true, validationMessagesText: '' }
                    ]
                },
                {
                    validation: validation.notpattern(),
                    flows: [
                        { viewValue: undefined, fieldValidity: true, validationMessagesText: ''},
                        { viewValue: '2', fieldValidity: false, validationMessagesText: 'Please type bigger numbers' },
                        { viewValue: '7', fieldValidity: false, validationMessagesText: 'Please type smaller numbers', fieldValidityErrorCodes: ['foo.invalid.bigNumbers'] },
                        { viewValue: '9', fieldValidity: true, validationMessagesText: '' },
                        { viewValue: '5', fieldValidity: false, validationMessagesText: 'Please type bigger numbers', fieldValidityErrorCodes: ['foo.invalid.smallNumbers', 'foo.invalid.bigNumbers'] },
                        { viewValue: '', fieldValidity: true, validationMessagesText: '' }
                    ]
                }
            ]
        }
//        { type: 'password', validValue: 'foo', invalidValue: '' },
//        { type: 'email', validValue: 'foo', invalidValue: '' },
//        { type: 'select', validValue: 'foo', invalidValue: '' },
//        { type: 'checkbox', validValue: true, invalidValue: false }
//        { type: 'text' }
    ];

    scenarios.forEach(function (scenario) {

        scenario.validationScenarios.forEach(function (validationScenario) {

            it('must check the validity of the field of type ' + scenario.type + ' for the validation ' + validationScenario.validation.type, function () {

                var model, formElement, fieldElement, validationMessagesElement;

                given(function () {
                    model = {
                        type: scenario.inputType,
                        name: 'foo',
                        value: '',
                        validation: [validationScenario.validation]
                    };
                });

                when(function () {
                    formElement = compileDirective('<form name="bla" form-handler>' +
                        '<nemo-input model="field"></nemo-input>' +
                        '<nemo-validation-messages model="bla[field.name]"></nemo-validation-messages>' +
                        '</form>', { $rootScope: { field: model } });
                });

                and(function () {
                    fieldElement = angular.element(formElement.children()[0]);
                    validationMessagesElement = angular.element(formElement.children()[1]);
                });

                then(function () {
                    expect(fieldElement.attr('validation-' + validationScenario.validation.type)).toBe('model.validation[0].rules');
                });

                validationScenario.flows.forEach(function (flow) {

                    when(function () {
                        if (flow.viewValue !== undefined) {
                            fieldElement.controller('ngModel').$setViewValue(flow.viewValue);
                        }
                    });

                    and(function () {
                        expect(fieldElement.controller('ngModel').$valid).toBe(flow.fieldValidity);
                    });

                    and(function () {
                        expect(formElement.controller('form').$valid).toBe(flow.fieldValidity);
                        if(!flow.fieldValidityErrorCodes) {
                          flow.fieldValidityErrorCodes = [ validationScenario.validation.rules[0].code ];
                        }
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
});