describe('nemo input', function () {

    beforeEach(function () {
        module('nemo');
    });

    var formElement, fieldElement, scenarios = [
        //Text
        { model: { "value": 'foo',    "type": "text" },     expectedType: 'text',       expectedTag: 'input',   expectedValue: 'foo' },
        { model: { "value": '',       "type": "text" },     expectedType: 'text',       expectedTag: 'input',   expectedValue: '' },
        { model: { "value": null,     "type": "text" },     expectedType: 'text',       expectedTag: 'input',   expectedValue: '' },
        { model: { "value": undefined,"type": "text" },     expectedType: 'text',       expectedTag: 'input',   expectedValue: '' },
        { model: {                    "type": "text" },     expectedType: 'text',       expectedTag: 'input',   expectedValue: '' },
        //Password
        { model: { "value": 'bar',    "type": "password" }, expectedType: 'password',   expectedTag: 'input',   expectedValue: 'bar' },
        { model: { "value": '',       "type": "password" }, expectedType: 'password',   expectedTag: 'input',   expectedValue: '' },
        { model: { "value": null,     "type": "password" }, expectedType: 'password',   expectedTag: 'input',   expectedValue: '' },
        { model: { "value": undefined,"type": "password" }, expectedType: 'password',   expectedTag: 'input',   expectedValue: '' },
        { model: {                    "type": "password" }, expectedType: 'password',   expectedTag: 'input',   expectedValue: '' },
        //Hidden
        { model: { "value": 'bla',    "type": "hidden" },   expectedType: 'hidden',     expectedTag: 'input',   expectedValue: 'bla' },
        { model: { "value": '',       "type": "hidden" },   expectedType: 'hidden',     expectedTag: 'input',   expectedValue: '' },
        { model: { "value": null,     "type": "hidden" },   expectedType: 'hidden',     expectedTag: 'input',   expectedValue: '' },
        { model: { "value": undefined,"type": "hidden" },   expectedType: 'hidden',     expectedTag: 'input',   expectedValue: '' },
        { model: {                    "type": "hidden" },   expectedType: 'hidden',     expectedTag: 'input',   expectedValue: '' },
        //Email
        { model: { "value": 'test',   "type": "email" },    expectedType: 'text',       expectedTag: 'input',   expectedValue: 'test' },
        { model: { "value": '',       "type": "email" },    expectedType: 'text',       expectedTag: 'input',   expectedValue: '' },
        { model: { "value": null,     "type": "email" },    expectedType: 'text',       expectedTag: 'input',   expectedValue: '' },
        { model: { "value": undefined,"type": "email" },    expectedType: 'text',       expectedTag: 'input',   expectedValue: '' },
        { model: {                    "type": "email" },    expectedType: 'text',       expectedTag: 'input',   expectedValue: '' },
        //Checkbox
        { model: { "value": true,     "type": "checkbox" }, expectedType: undefined,   expectedTag: 'div',     expectedValue: true },
        { model: { "value": false,    "type": "checkbox" }, expectedType: undefined,   expectedTag: 'div',     expectedValue: false },
        { model: { "value": 'true',   "type": "checkbox" }, expectedType: undefined,   expectedTag: 'div',     expectedValue: true },
        { model: { "value": 'false',  "type": "checkbox" }, expectedType: undefined,   expectedTag: 'div',     expectedValue: false },
        { model: { "value": null,     "type": "checkbox" }, expectedType: undefined,   expectedTag: 'div',     expectedValue: false },
        { model: { "value": undefined,"type": "checkbox" }, expectedType: undefined,   expectedTag: 'div',     expectedValue: false },
        { model: {                    "type": "checkbox" }, expectedType: undefined,   expectedTag: 'div',     expectedValue: false },
        //Select
        { model: { "value": 'MrsValue',"type": "select", options: [{ text: 'MrText', value: 'MrValue' }, { text: 'MrsText', value: 'MrsValue' }] },
            expectedType: undefined, expectedTag: 'select', expectedValue: 'MrsValue' },
        { model: { "value": '', "type": "select", options: [{ text: 'MrText', value: 'MrValue' }, { text: 'MrsText', value: 'MrsValue' }] },
            expectedType: undefined, expectedTag: 'select', expectedValue: '' },
        { model: { "value": null, "type": "select", options: [{ text: 'MrText', value: 'MrValue' }, { text: 'MrsText', value: 'MrsValue' }] },
            expectedType: undefined, expectedTag: 'select', expectedValue: '' },
        { model: { "value": undefined, "type": "select", options: [{ text: 'MrText', value: 'MrValue' }, { text: 'MrsText', value: 'MrsValue' }] },
            expectedType: undefined, expectedTag: 'select', expectedValue: '' },
        { model: { "type": "select", options: [{ text: 'MrText', value: 'MrValue' }, { text: 'MrsText', value: 'MrsValue' }] },
            expectedType: undefined, expectedTag: 'select', expectedValue: '' }
    ];

    scenarios.forEach(function (scenario) {

        it('must define the proper model and HTML structure for type "' + scenario.model.type + '"', function () {

            given(function () {
                formElement = compileDirective(
                    '<form name="foo" nemo-form-handler><nemo-input model="field"></nemo-input></form>',
                    { $rootScope: { field: scenario.model } });
            });

            and(function () {
                fieldElement = angular.element(formElement.children()[0]);
            });

            then(function () {
                expect(fieldElement.controller('ngModel').$viewValue).toBe(scenario.expectedValue);
                expect(fieldElement.controller('ngModel').$modelValue).toBe(scenario.expectedValue);
                expect(fieldElement.prop('tagName').toLowerCase()).toBe(scenario.expectedTag);
                expect(fieldElement.attr('type')).toBe(scenario.expectedType);
                expect(fieldElement.attr('input-' + scenario.model.type)).not.toBeUndefined();
                expect(fieldElement.attr('ng-model')).toBe('model.value');
            });
        });
    });

    describe('error handling', function () {

        var scenarios = [
            { template: '<form name="foo"><nemo-input model="field"></nemo-input></form>', expectation: 'no parent form handler is found'},
        ];

        scenarios.forEach(function (scenario) {

            it('must throw an error if ' + scenario.throwIfMessage, function () {

                then(function () {
                    expect(function() {
                        formElement = compileDirective(
                            scenario.template,
                            { $rootScope: { field: { "value": 'foo', "type": "text" } }});
                    }).toThrow();
                });
            });
        });
    });
});