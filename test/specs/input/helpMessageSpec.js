describe('help messages directive', function() {

    beforeEach(function () {
        module('nemo');
    });

    it('create an element with field name and help attributes',
        inject(function () {

            var markup, model, compiled, replaceStub;

            given(function () {
                replaceStub = sinon.stub().returns('derived-id');
                model = {
                    message: 'blah blah blah',
                    code: 'message.code.key'
                };

                markup = '<div data-nemo-help-messages model="model" fieldName="exampleField"></div>';
            });

            when(function () {
                compiled = compileDirective(markup, { $rootScope: { model: model }});
            });

            and(function () {
                expect(compiled.text()).toBe('blah blah blah');
            });
        })
    );

    it('creates an element to be used as a custom help message directive with field name and help attributes',
        function () {

            var markup, model, compiled, replaceStub, customHelpDirective;

            given(function () {
                replaceStub = sinon.stub().returns('derived-id');
                model = {
                    message: 'blah blah blah',
                    code: { replace: replaceStub }
                };

                markup = '<div data-nemo-help-messages model="model" fieldName="exampleField"></div>';
            });

            when(function () {
                compiled = compileDirective(markup, { $rootScope: { model: model }});
            });

            and(function () {
                customHelpDirective = angular.element(angular.element(compiled.children()[0]).children()[0]);
            });

            then("this is kind of a weird thing to test", function () {
                expect(replaceStub).toHaveBeenCalled(/\./g, '-');

            });

            and(function () {
                expect(customHelpDirective.attr('derived-id')).toBeTruthy();
                expect(customHelpDirective.attr('field-name')).toBeDefined();
                expect(customHelpDirective.attr('help')).toBe('help');
            });
        });

    describe('custom help directives', function () {

        var compileStub;

        beforeEach(function () {
            module('nemo');

            compileStub = sinon.stub().returns(sinon.stub());

            module(function ($provide) {
                $provide.value('$compile', compileStub);
            });
        });

        it('re-compiles itself in order to trigger any custom directives',
            inject(function () {

                var markup, model;

                given(function () {
                    model = {
                        message: 'blah blah blah',
                        code: 'message.code.key'
                    };

                    markup = '<div data-nemo-help-messages model="model" fieldName="exampleField"></div>';
                });

                when(function () {
                    compileDirective(markup, { $rootScope: { model: model }});
                });

                and(function () {
                    expect(compileStub).toHaveBeenCalled();
                });
            })
        );
    });

});