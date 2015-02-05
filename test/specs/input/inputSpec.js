describe('nemo input', function () {

    beforeEach(function () {
        module('nemo');
    });

    var formElement, fieldElement, scenarios = [
        { model: { "value": 'foo', "type": "text" },        expectedType: 'text',       expectedTag: 'input', expectedValue: 'foo' },
        { model: { "value": 'bar', "type": "password" },    expectedType: 'password',   expectedTag: 'input', expectedValue: 'bar' },
        { model: { "value": 'bla', "type": "hidden" },      expectedType: 'hidden',     expectedTag: 'input', expectedValue: 'bla' },
        { model: { "value": 'test', "type": "email" },      expectedType: 'text',       expectedTag: 'input', expectedValue: 'test' },
        { model: { "value": true, "type": "checkbox" },     expectedType: 'checkbox',   expectedTag: 'input', expectedValue: true },
        { model: { "value": false, "type": "checkbox" },    expectedType: 'checkbox',   expectedTag: 'input', expectedValue: false },
        { model: { "value": 'false', "type": "checkbox" },  expectedType: 'checkbox',   expectedTag: 'input', expectedValue: false },
        { model: { "value": 'true', "type": "checkbox" },   expectedType: 'checkbox',   expectedTag: 'input', expectedValue: false },
        { model: { "value": 'MrsValue', "type": "select", options: [{ text: 'MrText', value: 'MrValue' }, { text: 'MrsText', value: 'MrsValue' }] },
            expectedType: undefined, expectedTag: 'select', expectedValue: 'MrsValue' }
    ];

    scenarios.forEach(function (scenario) {

        it('must define the proper model and HTML structure for type "' + scenario.model.type + '"', function () {

            given(function () {
                formElement = compileDirective(
                    '<form name="foo" form-handler><nemo-input model="field"></nemo-input></form>',
                    { $rootScope: { field: scenario.model } });
            });

            and(function () {
                fieldElement = angular.element(formElement.children()[0]);
            });

            then(function () {
                expect(fieldElement.controller('ngModel').$viewValue).toBe(scenario.expectedValue);
                expect(fieldElement.prop('tagName').toLowerCase()).toBe(scenario.expectedTag);
                expect(fieldElement.attr('type')).toBe(scenario.expectedType);
                expect(fieldElement.attr('input-' + scenario.model.type)).not.toBeUndefined();
                expect(fieldElement.attr('ng-model')).toBe('model.value');
            });
        });
    });

    describe('error handling', function () {

        var scenarios = [
            { template: '<div name="foo" form-handler><nemo-input model="field"></nemo-input></div>', throwIfMessage: 'no parent form is found'},
            { template: '<form name="foo"><nemo-input model="field"></nemo-input></form>', expectation: 'no parent form handler is found'},
            { template: '<form form-handler><nemo-input model="field"></nemo-input></form>', expectation: 'no name attribute is found at the form level'},
            { template: '<form name="" form-handler><nemo-input model="field"></nemo-input></form>', expectation: 'an empty name attribute is found at the form level'}
        ];

        scenarios.forEach(function (scenario) {

            it('must throw an error if ' + scenario.throwIfMessage, function () {

                var compilationWrapper;

                given(function () {
                    compilationWrapper = function() {
                        formElement = compileDirective(
                            scenario.template,
                            { $rootScope: { field: { "value": 'foo', "type": "text" } }});
                    }
                });

                then(function () {
                    expect(compilationWrapper).toThrow();
                });
            });
        });
    });
});