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

        it('must return undefined without throwing an error if the skipRegisteredCheck flag is provided' +
        ' to any of the public interfaces', function() {
            var formHandlerCtrl;

            given(function () {
                formHandlerCtrl = compileController('nemoFormHandlerCtrl');
            });

            then(function () {
                expect(function () {
                    expect(formHandlerCtrl.setFieldValue('field2', 'foo', true)).toBeUndefined();
                    expect(formHandlerCtrl.getFieldValue('field2', true)).toBeUndefined();
                    expect(formHandlerCtrl.isFieldValid('field2', true)).toBeUndefined();
                    expect(formHandlerCtrl.isFieldTouched('field2', true)).toBeUndefined();
                    expect(formHandlerCtrl.isFieldActive('field2', true)).toBeUndefined();
                    expect(formHandlerCtrl.getFieldNgModelCtrl('field2', true)).toBeUndefined();
                    expect(formHandlerCtrl.forceInvalid('field2', true)).toBeUndefined();
                    expect(formHandlerCtrl.setActiveField('field2', true)).toBeUndefined();
                    expect(formHandlerCtrl.setFieldDirtyTouched('field2', true)).toBeUndefined();
                    expect(formHandlerCtrl.registerField('field2', true)).toBeUndefined();
                    expect(formHandlerCtrl.registerValidationRule('field2', true)).toBeUndefined();
                }).not.toThrow();
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
                    formHandlerCtrl.forceInvalid('rarrr');
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

    describe('release active field method', function () {

        it('must call the releaseActiveField function for a specific registered field', function () {

            var formHandlerCtrl, releaseActive;

            given(function () {
                formHandlerCtrl = compileController('nemoFormHandlerCtrl');
                releaseActive = sinon.stub();
            });

            when(function () {
                formHandlerCtrl.registerField('field1', {releaseActive: releaseActive});
            });

            and(function () {
                formHandlerCtrl.releaseActiveField('field1');
            });

            then(function () {
                expect(releaseActive).toHaveBeenCalledWith('field1');
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

    describe('validating the form', function () {
        it('must invoke the refreshValidity function of all the registered validation rules' +
        'and the setFilthy function of all the fields whenever the ' +
        'validateFormAndSetDirtyTouched function of the formHanderController is invoked', function () {

            var formHandlerCtrl, validationRule1InterfaceFns, validationRule2InterfaceFns, field1InterfaceFns,
                field2InterfaceFns;

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

            and(function () {
                field1InterfaceFns = {
                    setFilthy: sinon.stub()
                };
                field2InterfaceFns = {
                    setFilthy: sinon.stub()
                };
            });

            when(function () {
                formHandlerCtrl.registerField('field1', field1InterfaceFns);
                formHandlerCtrl.registerField('field2', field2InterfaceFns);
            });

            and(function () {
                formHandlerCtrl.registerValidationRule('field.validationRule1', validationRule1InterfaceFns);
                formHandlerCtrl.registerValidationRule('field.validationRule2', validationRule2InterfaceFns);
            });

            and(function () {
                formHandlerCtrl.validateFormAndSetDirtyTouched();
            });

            then(function () {
                expect(validationRule1InterfaceFns.refreshValidity).toHaveBeenCalled();
                expect(validationRule2InterfaceFns.refreshValidity).toHaveBeenCalled();
            });

            and(function () {
                expect(field1InterfaceFns.setFilthy).toHaveBeenCalled();
                expect(field2InterfaceFns.setFilthy).toHaveBeenCalled();
            })
        });


        it('must invoke the refreshValidity function of all the registered validation rules, but not the setFilthy ' +
        'function of the fields whenever the ' +
        'validateForm function of the formHanderController is invoked', function () {

            var formHandlerCtrl, validationRule1InterfaceFns, validationRule2InterfaceFns, field1InterfaceFns,
                field2InterfaceFns;

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

            and(function () {
                field1InterfaceFns = {
                    setFilthy: sinon.stub()
                };
                field2InterfaceFns = {
                    setFilthy: sinon.stub()
                };
            });

            when(function () {
                formHandlerCtrl.registerField('field1', field1InterfaceFns);
                formHandlerCtrl.registerField('field2', field2InterfaceFns);
            });

            and(function () {
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

            and(function () {
                expect(field1InterfaceFns.setFilthy).not.toHaveBeenCalled();
                expect(field2InterfaceFns.setFilthy).not.toHaveBeenCalled();
            })
        });
    });

    [
        { formInterface: 'getFieldNgModelCtrl', elInterface: 'getNgModelCtrl' },
        { formInterface: 'isFieldActive', elInterface: 'isActive' },
        { formInterface: 'isFieldValid', elInterface: 'isValid' },
        { formInterface: 'isFieldTouched', elInterface: 'isTouched' },
        { formInterface: 'setFieldDirtyTouched', elInterface: 'setFilthy' }
    ].forEach(
        function (scenario) {
            it('must call the ' + scenario.elInterface + ' function of the registered field whenever ' +
            'the ' + scenario.formInterface + ' function of the formHanderController is invoked', function () {

                var formHandlerCtrl, fieldOneStub, fieldTwoStub;

                given(function () {
                    formHandlerCtrl = compileController('nemoFormHandlerCtrl');
                    fieldOneStub = sinon.stub();
                    fieldTwoStub = sinon.stub();
                });

                when(function () {
                    var field2 = {},
                        field1 = {};

                    field1[scenario.elInterface] = fieldOneStub;
                    field2[scenario.elInterface] = fieldTwoStub;

                    formHandlerCtrl.registerField('field1', field1);
                    formHandlerCtrl.registerField('field2', field2);
                });

                and(function () {
                    formHandlerCtrl[scenario.formInterface]('field2');
                });

                then(function () {
                    expect(fieldOneStub).not.toHaveBeenCalled();
                    expect(fieldTwoStub).toHaveBeenCalled();
                });
            });
        }
    );
});