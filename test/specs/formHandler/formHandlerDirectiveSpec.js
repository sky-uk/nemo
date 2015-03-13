describe('nemo form handler directive', function () {

    beforeEach(function () {
        module('nemo');
    });

    describe('get field value method', function () {

        it('must call the getValue method of the given field', function () {

            var formHandlerCtrl, fieldInterfaceFns, fieldValue;

            given(function () {
                formHandlerCtrl = compileController('nemoFormHandlerCtrl');
            });

            and(function () {
                fieldInterfaceFns = {
                    getValue: sinon.stub().returns('foo')
                };
            });

            when(function () {
                formHandlerCtrl.registerField('field1', fieldInterfaceFns);
            });

            and(function () {
                fieldValue = formHandlerCtrl.getFieldValue('field1');
            });

            then(function () {
                expect(fieldInterfaceFns.getValue).toHaveBeenCalled();
                expect(fieldValue).toBe('foo');
            });
        });

        it('must throw if field does exist', function () {
            var formHandlerCtrl, fieldInterfaceFns;

            given(function () {
                formHandlerCtrl = compileController('nemoFormHandlerCtrl');
            });

            and(function () {
                fieldInterfaceFns = {
                    getValue: sinon.stub().returns('foo')
                };
            });

            when(function () {
                formHandlerCtrl.registerField('field1', fieldInterfaceFns);
            });

            then(function () {
                expect(function () {
                    formHandlerCtrl.getFieldValue('rarrr');
                }).toThrow('rarrr is not registered in the form.');
            });
        });
    });

    describe('set field value method', function () {

        it('must call the setValue method of the given field with the new value', function () {

            var formHandlerCtrl, fieldInterfaceFns;

            given(function () {
                formHandlerCtrl = compileController('nemoFormHandlerCtrl');
            });

            and(function () {
                fieldInterfaceFns = {
                    setValue: sinon.stub()
                };
            });

            when(function () {
                formHandlerCtrl.registerField('field1', fieldInterfaceFns);
            });

            and(function () {
                formHandlerCtrl.setFieldValue('field1', 'dave');
            });

            then(function () {
                expect(fieldInterfaceFns.setValue).toHaveBeenCalledWith('dave');
            });
        });

        it('must throw if field does exist', function () {
            var formHandlerCtrl, fieldInterfaceFns;

            given(function () {
                formHandlerCtrl = compileController('nemoFormHandlerCtrl');
            });

            and(function () {
                fieldInterfaceFns = {
                    getValue: sinon.stub().returns('foo')
                };
            });

            when(function () {
                formHandlerCtrl.registerField('field1', fieldInterfaceFns);
            });

            then(function () {
                expect(function () {
                    formHandlerCtrl.setFieldValue('rarrr', 'blah');
                }).toThrow('rarrr is not registered in the form.');
            });
        });
    });

    describe('force validity method', function () {

        it('must call a specific field\'s forceValidity function for a set of registered fields', function () {

            var formHandlerCtrl, field1ValidityChange, field2ValidityChange;

            given(function () {
                formHandlerCtrl = compileController('nemoFormHandlerCtrl');
                field1ValidityChange = sinon.stub();
                field2ValidityChange = sinon.stub();
            });

            when(function () {
                formHandlerCtrl.registerField('field1', {validityChange: field1ValidityChange});
                formHandlerCtrl.registerField('field2', {validityChange: field2ValidityChange});
            });

            and(function () {
                formHandlerCtrl.forceValidity('field2', 'field2.invalid', false);
            });

            then(function () {
                expect(field1ValidityChange).not.toHaveBeenCalled();
                expect(field2ValidityChange).toHaveBeenCalledWith('field2.invalid', false);
            });
        });

        it('must throw if field does exist', function () {
            var formHandlerCtrl, fieldInterfaceFns;

            given(function () {
                formHandlerCtrl = compileController('nemoFormHandlerCtrl');
            });

            and(function () {
                fieldInterfaceFns = {
                    getValue: sinon.stub().returns('foo')
                };
            });

            when(function () {
                formHandlerCtrl.registerField('field1', fieldInterfaceFns);
            });

            then(function () {
                expect(function () {
                    formHandlerCtrl.forceValidity('rarrr', 'rarrr.invalid', false);
                }).toThrow('rarrr is not registered in the form.');
            });
        });

    });

    describe('set active field method', function () {

        it('must call all field\'s setActiveField functions for a set of registered fields', function () {

            var formHandlerCtrl, field1ActiveFieldChange, field2ActiveFieldChange;

            given(function () {
                formHandlerCtrl = compileController('nemoFormHandlerCtrl');
                field1ActiveFieldChange = sinon.stub();
                field2ActiveFieldChange = sinon.stub();
            });

            when(function () {
                formHandlerCtrl.registerField('field1', {activeFieldChange: field1ActiveFieldChange});
                formHandlerCtrl.registerField('field2', {activeFieldChange: field2ActiveFieldChange});
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

    describe('give first invalid field focus method', function () {

        var scenarios = [
            {field1: {isValid: true, setFocusCallCount: 0}, field2: {isValid: false, setFocusCallCount: 1}},
            {field1: {isValid: false, setFocusCallCount: 1}, field2: {isValid: true, setFocusCallCount: 0}},
            {field1: {isValid: false, setFocusCallCount: 1}, field2: {isValid: false, setFocusCallCount: 0}},
            {field1: {isValid: true, setFocusCallCount: 0}, field2: {isValid: true, setFocusCallCount: 0}}
        ];

        scenarios.forEach(function (scenario) {


            it('must call the setFocus method of the first invalid field', function () {

                var formHandlerCtrl, field1InterfaceFns, field2InterfaceFns;

                given(function () {
                    formHandlerCtrl = compileController('nemoFormHandlerCtrl');
                });

                and(function () {
                    field1InterfaceFns = {
                        isValid: sinon.stub().returns(scenario.field1.isValid),
                        setFocus: sinon.stub()
                    };
                    field2InterfaceFns = {
                        isValid: sinon.stub().returns(scenario.field2.isValid),
                        setFocus: sinon.stub()
                    };
                });

                when(function () {
                    formHandlerCtrl.registerField('field1', field1InterfaceFns);
                    formHandlerCtrl.registerField('field2', field2InterfaceFns);
                });

                and(function () {
                    formHandlerCtrl.giveFirstInvalidFieldFocus('field2');
                });

                then(function () {
                    expect(field1InterfaceFns.setFocus.callCount).toBe(scenario.field1.setFocusCallCount);
                    expect(field2InterfaceFns.setFocus.callCount).toBe(scenario.field2.setFocusCallCount);
                });
            });
        });
    });
});