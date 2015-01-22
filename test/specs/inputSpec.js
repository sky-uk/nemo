describe('app config', function () {

    beforeEach(function () {
        module('nemo');
    });

    var formElement, fieldElement, scenarios = [
        { model: { "value": 'foo', "type": "text" },        expectedType: 'text',       expectedTag: 'input', expectedValue: 'foo' },
        { model: { "value": 'bar', "type": "password" },    expectedType: 'password',   expectedTag: 'input', expectedValue: 'bar' },
        { model: { "value": 'bla', "type": "hidden" },      expectedType: 'hidden',     expectedTag: 'input', expectedValue: 'bla' },
        { model: { "value": 'test', "type": "email" },      expectedType: 'email',      expectedTag: 'input', expectedValue: 'test' },
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
                    '<form form-handler><nemo model="field"></nemo></form>',
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

        it('must throw an error if no parent form is found', function () {

            var compilationWrapper;

            given(function () {
                compilationWrapper = function() {
                    formElement = compileDirective(
                        '<div form-handler><nemo model="field"></nemo></div>',
                        { $rootScope: { field: { "value": 'foo', "type": "text" } }});
                }

            });

            then(function () {
                expect(compilationWrapper).toThrow();
            });
        });

        it('must throw an error if no parent form handler is found', function () {

            var compilationWrapper;

            given(function () {
                compilationWrapper = function() {
                    formElement = compileDirective(
                        '<form><nemo model="field"></nemo></form>',
                        { $rootScope: { field: { "value": 'foo', "type": "text" } }});
                }

            });

            then(function () {
                expect(compilationWrapper).toThrow();
            });
        });
    });
});