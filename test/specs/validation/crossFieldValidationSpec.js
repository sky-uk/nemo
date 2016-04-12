describe('validation', function () {

    beforeEach(function () {
        module('nemo');
    });

    var validation = TESTDATA.validation;

    [
        {
            validation: validation.mustnotcontain(),
            flows: [
                { viewValue: undefined, fieldValidity: true, validationMessagesText: '', forceValidationOfForm: true},
                { viewValue: 'fooUsername', fieldValidity: false, validationMessagesText: 'Foo cant contain username' },
                { viewValue: 'foousername', fieldValidity: false, validationMessagesText: 'Foo cant contain username' },
                { viewValue: 'blahfoo', fieldValidity: false, validationMessagesText: 'Foo cant contain username', otherFieldValue: 'blah' },
                { viewValue: 'foo', fieldValidity: true, validationMessagesText: '' },
                { viewValue: '', fieldValidity: true, validationMessagesText: '' }
            ]
        },
        {
            validation: validation.mustmatch(),
            flows: [
                { viewValue: undefined, fieldValidity: true, validationMessagesText: '', forceValidationOfForm: true},
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
                { viewValue: undefined, fieldValidity: true, validationMessagesText: '', forceValidationOfForm: true},
                { viewValue: '', fieldValidity: true, validationMessagesText: ''}
            ]
        },
        {
            validation: validation.dependentpattern(),
            flows: [
                { viewValue: undefined, fieldValidity: true, validationMessagesText: '', forceValidationOfForm: true},
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
                { viewValue: undefined, fieldValidity: false, validationMessagesText: '', forceValidationOfForm: true},
                { viewValue: 'foo', fieldValidity: true, validationMessagesText: ''},
                { viewValue: '', fieldValidity: false, validationMessagesText: 'Foo is required'},
                { viewValue: undefined, fieldValidity: true, validationMessagesText: '', otherFieldValue: 'dave', forceValidationOfForm: true}
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
                    validationMessagesElement = angular.element(angular.element(formElement.children()[2]).children()[0]);
                });

                then(function () {
                    expect(firstFieldElement.attr('validation-' + validationScenario.type)).toBe('model.properties.validation[0].rules');
                });

                when(function () {

                    if (flow.viewValue !== undefined) {
                        firstFieldElement.controller('ngModel').$setViewValue(flow.viewValue);
                    }

                    if (flow.otherFieldValue !== undefined) {
                        secondFieldElement.controller('ngModel').$setViewValue(flow.otherFieldValue);
                    }
                    //force form to validate when entering undefined as there is no change so it won't get triggered otherwise
                    if (flow.forceValidationOfForm) {
                        formElement.controller('nemoFormHandler').validateFormAndSetDirtyTouched();
                    }
                    firstFieldElement.scope().$digest();
                });

                then(function () {
                    expect(firstFieldElement.controller('ngModel').$valid).toBe(flow.fieldValidity);
                    expect(formElement.controller('form').$valid).toBe(flow.fieldValidity);
                });


                when(function () {
                    flow.fieldValidityErrorIds = [validationScenario.rules[0].id];
                });

                and(function () {
                    expect(Object.keys(formElement.controller('form').$error)).toEqual(flow.fieldValidity ? [] : flow.fieldValidityErrorIds);
                });

                and(function () {
                    expect(validationMessagesElement.text()).toBe(flow.validationMessagesText);
                });
            });
        });
    });

    describe('mustnotcontainmatchedgroup', function() {
        var mustnotcontainmatchedgroup = validation.mustnotcontainmatchedgroup();

        [
            {usernameValue: 'foo', emailValue: undefined, passwordValue: 'bar', fieldValidity: true, validationMessagesText: '', fieldValidityErrorIds: []},
            {usernameValue: 'foo', emailValue: 'email', passwordValue: 'bar', fieldValidity: true, validationMessagesText: '', fieldValidityErrorIds: []},
            {usernameValue: undefined, emailValue: 'email', passwordValue: 'bar', fieldValidity: true, validationMessagesText: '', fieldValidityErrorIds: []},
            {usernameValue: undefined, emailValue: undefined, passwordValue: 'bar', fieldValidity: true, validationMessagesText:'', fieldValidityErrorIds: []},
            {usernameValue: undefined, emailValue: undefined, passwordValue: undefined, fieldValidity: true, validationMessagesText:'', fieldValidityErrorIds: []},
            {usernameValue: 'bar foo', emailValue: undefined, passwordValue: 'foo', fieldValidity: true, validationMessagesText:'', fieldValidityErrorIds: []},
            {usernameValue: 'foo bar', emailValue: undefined, passwordValue: 'foo', fieldValidity: false, validationMessagesText:'Password cant contain username', fieldValidityErrorIds: ['foo.contains.username']},
            {usernameValue: 'foo', emailValue: undefined, passwordValue: 'foo', fieldValidity: false, validationMessagesText:'Password cant contain username', fieldValidityErrorIds: ['foo.contains.username']},
            {usernameValue: 'foo', emailValue: 'email@test.com', passwordValue: 'email', fieldValidity: false, validationMessagesText:'Password cant contain email', fieldValidityErrorIds: ['foo.contains.email']}
        ].forEach(function(scenario) {
            it('checks the cross validity for mustnotcontainmatchedgroup', function() {
                var passwordModel, usernameModel, emailModel, formElement, passwordElement, usernameElement, emailElement, validationMessagesElement;
                given(function () {
                    passwordModel = {
                        type: 'text',
                        name: 'pwd',
                        value: '',
                        properties: {
                            validation: [mustnotcontainmatchedgroup]
                        }
                    };

                    usernameModel = {
                        type: 'text',
                        name: 'username',
                        value: scenario.usernameValue,
                        properties: {
                            validation: []
                        }
                    };

                    emailModel = {
                        type: 'email',
                        name: 'email',
                        value: scenario.emailValue,
                        properties: {
                            validation: []
                        }
                    };
                });

                when(function () {
                    formElement = compileDirective('<form name="bla" nemo-form-handler>' +
                    '<nemo-input model="field"></nemo-input>' +
                    '<nemo-input model="field2"></nemo-input>' +
                    '<nemo-input model="field3"></nemo-input>' +
                    '<nemo-validation-messages model="bla[field.name]"></nemo-validation-messages>' +
                    '</form>', { $rootScope: { field: passwordModel, field2: usernameModel, field3: emailModel} });

                });

                and(function () {
                    passwordElement = angular.element(formElement.children()[0]);
                    usernameElement = angular.element(formElement.children()[1]);
                    emailElement = angular.element(formElement.children()[2]);
                    validationMessagesElement = angular.element(angular.element(formElement.children()[3]).children()[0]);
                });

                then(function () {
                    expect(passwordElement.attr('validation-' + mustnotcontainmatchedgroup.type)).toBe('model.properties.validation[0].rules');
                });

                when(function () {
                    passwordElement.controller('ngModel').$setViewValue(scenario.passwordValue);
                    passwordElement.scope().$digest();
                });

                then(function () {
                    expect(passwordElement.controller('ngModel').$valid).toBe(scenario.fieldValidity);
                    expect(formElement.controller('form').$valid).toBe(scenario.fieldValidity);
                });

                and(function () {
                    expect(Object.keys(formElement.controller('form').$error)).toEqual(scenario.fieldValidityErrorIds);
                });

                and(function () {
                    expect(validationMessagesElement.text()).toBe(scenario.validationMessagesText);
                });
            });
        });
    });
});