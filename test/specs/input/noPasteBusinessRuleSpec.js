describe('noPasteBusinessRule', function () {

    beforeEach(function () {
        module('nemo');
    });

    [
        {
            disallowedPaste: false,
            message: 'NOT disable paste'
        },
        {
            disallowedPaste: true,
            message: ' disable paste'
        }

    ].forEach(function (scenario) {
        it('should' + scenario.message, function () {

            var usernameModel, confirmUsernameModel, formElement, confirmUsernameField;

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
                        businessrules: scenario.disallowedPaste ? ['noPaste'] : []
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
                expect(confirmUsernameField.getAttribute('onPaste')).toBe(scenario.disallowedPaste ? 'return false;' : null);
            });
        });
    });

});