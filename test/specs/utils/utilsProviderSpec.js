ddescribe('nemo utils provider', function () {

    var scope, utilsProvider, fakeNgModelCtrl, fakeNemoMessagesProvider;

    beforeEach(function () {

        module('nemo');

        module(function (utils, nemoMessages) {
            utilsProvider = utils;
            fakeNemoMessagesProvider = nemoMessages;
            sinon.stub(fakeNemoMessagesProvider, 'set');
        });

        inject(function ($rootScope) {
            scope = $rootScope.$new();
            scope.model = {
                name: 'foo'
            }
        });

        fakeNgModelCtrl = {
            $setValidity: sinon.stub()
        };
    });

    describe('forceServerInvalid', function () {

        it('must set the message that belongs to the calculated validation id', function () {

            when(function () {
                utilsProvider.forceServerInvalid('error message', 1, scope, fakeNgModelCtrl);
            });

            then(function () {
                expect(fakeNemoMessagesProvider.set).toHaveBeenCalledWith('foo0', 'error message');
            });
        });
    });
});