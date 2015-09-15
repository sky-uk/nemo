describe('icon directive', function () {

    beforeEach(module('nemo'));

    [
        { type: 'error', expectedText: '!'},
        { type: 'help', expectedText: '?'},
        { type: 'valid', expectedText: '✔'},
        { type: 'foo', expectedText: ''}

    ].forEach(function (scenario) {

        it('must return ' + scenario.expectedText + ' icon text if type is ' + scenario.type +
        ' when calling the getText method of the scope', function () {

            var element, scope, text;

            given(function () {
                element = compileDirective('<data-nemo-icon type="{{getMessageType(field.name)}}"></data-nemo-icon>');
                scope = element.isolateScope();
            });

            when(function () {
                text = scope.getText(scenario.type);
            });

            then(function () {
                expect(text).toBe(scenario.expectedText);
            });
        });
    });


});