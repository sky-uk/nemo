describe('nemo form handler directive', function () {

    beforeEach(function () {
        module('nemo');
    });

    it('must call a specific field\'s forceValidity function for a set of registered fields', function () {

        var formHandlerCtrl, field1ValidityChange, field2ValidityChange;

        given(function () {
            formHandlerCtrl = compileController('nemoFormHandlerCtrl', { $attrs: { name: 'bla'}});
            field1ValidityChange = sinon.stub();
            field2ValidityChange = sinon.stub();
        });

        when(function () {
            formHandlerCtrl.registerField('field1', { validityChange: field1ValidityChange });
            formHandlerCtrl.registerField('field2', { validityChange: field2ValidityChange });
        });

        and(function () {
            formHandlerCtrl.forceValidity('field2', 'field2.invalid', false);
        });

        then(function () {
            expect(field1ValidityChange).not.toHaveBeenCalled();
            expect(field2ValidityChange).toHaveBeenCalledWith('field2.invalid', false);
        });
    });

    it('must call all field\'s setActiveField functions for a set of registered fields', function () {

        var formHandlerCtrl, field1ActiveFieldChange, field2ActiveFieldChange;

        given(function () {
            formHandlerCtrl = compileController('nemoFormHandlerCtrl', { $attrs: { name: 'bla'}});
            field1ActiveFieldChange = sinon.stub();
            field2ActiveFieldChange = sinon.stub();
        });

        when(function () {
            formHandlerCtrl.registerField('field1', { activeFieldChange: field1ActiveFieldChange });
            formHandlerCtrl.registerField('field2', { activeFieldChange: field2ActiveFieldChange });
        });

        and(function () {
            formHandlerCtrl.setActiveField('field2');
        });

        then(function () {
            expect(field1ActiveFieldChange).toHaveBeenCalledWith('field2');
            expect(field2ActiveFieldChange).toHaveBeenCalledWith('field2');
        });
    });
});