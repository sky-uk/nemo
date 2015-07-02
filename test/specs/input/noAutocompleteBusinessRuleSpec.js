describe('noAutocompleteBusinessRule', function () {

    beforeEach(function () {
        module('nemo');
    });

    [
        {
            noAutocomplete: false,
            message: ' NOT disable autocomplete'
        },
        {
            noAutocomplete: true,
            message: 'disable autocomplete'
        }

    ].forEach(function (scenario) {
        it('should ' + scenario.message, function () {

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
                        businessrules: scenario.noAutocomplete ? ['noAutocomplete'] : []
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
                expect(confirmUsernameField.getAttribute('autocomplete')).toBe(scenario.noAutocomplete ? 'off' : null);
            });
        });
    });

});