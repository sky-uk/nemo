describe('noPasteDirective', function () {

    beforeEach(function () {
        module('nemo');
    });

    var validation = TESTDATA.validation;

    [
        {
            validation: validation.required(),
            disallowedPaste: false
        },
        {
            validation: validation.mustmatch(),
            disallowedPaste: true
        }

    ].forEach(function (scenario) {
        var validationScenario = scenario.validation;

        it('should' + (scenario.disallowedPaste ? '' : ' not')
        + ' be added to the element when validation type is'
        + (validationScenario.type == 'mustmatch' ? '' : ' not')
        + ' mustmatch', function () {

            var usernameModel, confirmUsernameModel, formElement, confirmUsernameField, pasteEvent;

            given(function () {
                usernameModel = {
                    type: 'text',
                    name: 'username',
                    value: ''
                };
                confirmUsernameModel = {
                    type: 'text',
                    name: 'confirmUsername',
                    value: '',
                    properties: {
                        validation: [validationScenario]
                    }
                };
            });

            when(function () {
                formElement = compileDirective('<form name="formName" nemo-form-handler>' +
                '<nemo-input model="username"></nemo-input>' +
                '<nemo-input model="confirmUsername"></nemo-input>' +
                '</form>', { $rootScope: { username: usernameModel, confirmUsername: confirmUsernameModel } });
            });

            and(function () {
                confirmUsernameField = formElement.children()[1];
            });

            then(function () {
                expect(confirmUsernameField.getAttribute('nemo-no-paste')).toBe(scenario.disallowedPaste ? 'true' : null);
            });

            when(function() {
                pasteEvent = new Event('paste');
                pasteEvent.preventDefault = sinon.mock();
                confirmUsernameField.dispatchEvent(pasteEvent);
            });

            then(function() {
                pasteEvent.preventDefault.exactly( scenario.disallowedPaste ? 1 : 0);
            });
        });
    });

});