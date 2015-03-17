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

    describe('force invalid method', function () {

        it('must call a specific field\'s forceInvalid function for a set of registered fields', function () {

            var formHandlerCtrl, field1forceInvalid, field2forceInvalid;

            given(function () {
                formHandlerCtrl = compileController('nemoFormHandlerCtrl');
                field1forceInvalid = sinon.stub();
                field2forceInvalid = sinon.stub();
            });

            when(function () {
                formHandlerCtrl.registerField('field1', {forceInvalid: field1forceInvalid});
                formHandlerCtrl.registerField('field2', {forceInvalid: field2forceInvalid});
            });

            and(function () {
                formHandlerCtrl.forceInvalid('field2', 'field2.invalid');
            });

            then(function () {
                expect(field1forceInvalid).not.toHaveBeenCalled();
                expect(field2forceInvalid).toHaveBeenCalledWith('field2.invalid');
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
                    formHandlerCtrl.forceInvalid('rarrr', 'rarrr.invalid', false);
                }).toThrow('rarrr is not registered in the form.');
            });
        });

    });

    describe('force forceDirty method', function () {

        it('must call all forceDirty function for a set of registered fields', function () {

            var formHandlerCtrl, field1forceDirty, field2forceDirty;

            given(function () {
                formHandlerCtrl = compileController('nemoFormHandlerCtrl');
                field1forceDirty = sinon.stub();
                field2forceDirty = sinon.stub();
            });

            when(function () {
                formHandlerCtrl.registerField('field1', {forceDirty: field1forceDirty});
                formHandlerCtrl.registerField('field2', {forceDirty: field2forceDirty});
            });

            and(function () {
                formHandlerCtrl.forceAllFieldsToBeDirty();
            });

            then(function () {
                expect(field1forceDirty).toHaveBeenCalled();
                expect(field2forceDirty).toHaveBeenCalledWith();
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

    describe('give first field focus method', function () {

        it('must call the setFocus method of the first field', function () {

            var formHandlerCtrl, field1InterfaceFns, field2InterfaceFns;

            given(function () {
                formHandlerCtrl = compileController('nemoFormHandlerCtrl');
            });

            and(function () {
                field1InterfaceFns = {
                    setFocus: sinon.stub()
                };
                field2InterfaceFns = {
                    setFocus: sinon.stub()
                };
            });

            when(function () {
                formHandlerCtrl.registerField('field1', field1InterfaceFns);
                formHandlerCtrl.registerField('field2', field2InterfaceFns);
            });

            and(function () {
                formHandlerCtrl.giveFirstFieldFocus();
            });

            then(function () {
                expect(field1InterfaceFns.setFocus).toHaveBeenCalled();
                expect(field2InterfaceFns.setFocus).not.toHaveBeenCalled();
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