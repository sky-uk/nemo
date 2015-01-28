describe('nemo validation messages', function () {

    beforeEach(function () {
        module('nemo');
    });

    var scenarios = [
        { type: 'text', validValue: 'foo', invalidValue: '' },
        { type: 'password', validValue: 'foo', invalidValue: '' },
        { type: 'email', validValue: 'foo', invalidValue: '' },
        { type: 'select', validValue: 'foo', invalidValue: '' },
        { type: 'checkbox', validValue: true, invalidValue: false }
//        { type: 'text' }
    ];

    scenarios.forEach(function (scenario) {

        iit('must check the validity of the field of type' + scenario.type + ' both specifying valid and invalid values', function () {

            var model, formElement, fieldElement, validationMessagesElement;

            given(function () {
                model = {
                    type: scenario.type,
                    name: 'foo',
                    value: '',
                    validation: [
                        {
                            "type": "required",
                            "rules": [
                                {
                                    "value": true,
                                    "code": "foo.blank",
                                    "message": "Please enter something"
                                }
                            ]
                        }
                    ]
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
                expect(fieldElement.attr('validation-required')).toBe('model.validation[0].rules');
            });

            var flows = [
                { viewValue: undefined, fieldValidity: false, formValidity: false, validationMessagesLength: 0, validationMessagesText: ''},
                { viewValue: scenario.validValue, fieldValidity: true, formValidity: true, validationMessagesLength: 0, validationMessagesText: '' },
                { viewValue: scenario.invalidValue, fieldValidity: false, formValidity: false, validationMessagesLength: 1, validationMessagesText: 'Please enter something' },
            ];

            flows.forEach(function (flow) {

                when(function () {

                    if (flow.viewValue !== undefined) {
                        fieldElement.controller('ngModel').$setViewValue(flow.viewValue);
                    }
                });

                and(function () {
                    expect(fieldElement.controller('ngModel').$valid).toBe(flow.fieldValidity);
                });

                and(function () {
                    expect(formElement.controller('form').$valid).toBe(flow.formValidity);
                    expect(Object.keys(formElement.controller('form').$error).indexOf('foo.blank')).toBe(flow.fieldValidity ? -1 : 0);
                });

                and(function () {
                    expect(validationMessagesElement.children().length).toBe(flow.validationMessagesLength);
//                    expect(validationMessagesElement.text()).toBe(flow.validationMessagesText);

                });
            });
        });
    });
});