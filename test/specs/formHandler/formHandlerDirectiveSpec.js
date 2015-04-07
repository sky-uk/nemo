describe('nemo form handler directive', function () {

    beforeEach(function () {
        module('nemo');
    });

    describe('get fields values method', function () {

        it('must call the getValue method of all the registered fields', function () {

            var formHandlerCtrl, field1InterfaceFns, field2InterfaceFns, fieldsValues;

            given(function () {
                formHandlerCtrl = compileController('nemoFormHandlerCtrl');
            });

            and(function () {
                field1InterfaceFns = {
                    getValue: sinon.stub().returns('foo')
                };
                field2InterfaceFns = {
                    getValue: sinon.stub().returns('bar')
                };
            });

            when(function () {
                formHandlerCtrl.registerField('field1', field1InterfaceFns);
                formHandlerCtrl.registerField('field2', field2InterfaceFns);
            });

            and(function () {
                fieldsValues = formHandlerCtrl.getFieldsValues();
            });

            then(function () {
                expect(field1InterfaceFns.getValue).toHaveBeenCalled();
                expect(field2InterfaceFns.getValue).toHaveBeenCalled();
                expect(fieldsValues).toEqual({ field1: 'foo', field2: 'bar'});
            });
        });
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

        it('must call a specific validation rule\'s forceInvalid function for a set of registered validation rules', function () {

            var formHandlerCtrl, validationRule11forceInvalid, validationRule2forceInvalid;

            given(function () {
                formHandlerCtrl = compileController('nemoFormHandlerCtrl');
                validationRule11forceInvalid = sinon.stub();
                validationRule2forceInvalid = sinon.stub();
            });

            when(function () {
                formHandlerCtrl.registerValidationRule('field.invalid1', {forceInvalid: validationRule11forceInvalid});
                formHandlerCtrl.registerValidationRule('field.invalid2', {forceInvalid: validationRule2forceInvalid});
            });

            and(function () {
                formHandlerCtrl.forceInvalid('field.invalid2');
            });

            then(function () {
                expect(validationRule11forceInvalid).not.toHaveBeenCalled();
                expect(validationRule2forceInvalid).toHaveBeenCalledWith('field.invalid2');
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

    it('must invoke the refreshValidity function of all the registered validation rules whenever the ' +
    'validateForm function of the formHanderController is invoked', function () {

        var formHandlerCtrl, validationRule1InterfaceFns, validationRule2InterfaceFns;

        given(function () {
            formHandlerCtrl = compileController('nemoFormHandlerCtrl');
        });

        and(function () {
            validationRule1InterfaceFns = {
                refreshValidity: sinon.stub()
            };
            validationRule2InterfaceFns = {
                refreshValidity: sinon.stub()
            };
        });

        when(function () {
            formHandlerCtrl.registerValidationRule('field.validationRule1', validationRule1InterfaceFns);
            formHandlerCtrl.registerValidationRule('field.validationRule2', validationRule2InterfaceFns);
        });

        and(function () {
            formHandlerCtrl.validateForm();
        });

        then(function () {
            expect(validationRule1InterfaceFns.refreshValidity).toHaveBeenCalled();
            expect(validationRule2InterfaceFns.refreshValidity).toHaveBeenCalled();
        });
    });
});