describe('nemo utils provider', function () {

    var scope, utilsProvider, fakeNgModelCtrl, fakeMessagesProvider;

    beforeEach(function () {

        module('nemo');

        module(function (nemoUtilsProvider, nemoMessagesProvider) {
            utilsProvider = nemoUtilsProvider;
            fakeMessagesProvider = nemoMessagesProvider;
            sinon.stub(fakeMessagesProvider, 'set');
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
                expect(fakeMessagesProvider.set).toHaveBeenCalledWith('foo1', 'error message');
                expect(fakeNgModelCtrl.$setValidity).toHaveBeenCalledWith('foo1', false);
            });
        });

        it('must manage the validity change, setting the field as valid once its value changes', function () {

            when(function () {
                utilsProvider.forceServerInvalid('error message', 1, scope, fakeNgModelCtrl);
                scope.$apply();
            });

            then(function () {
               expect(fakeNgModelCtrl.$setValidity.callCount).toBe(1);
            });

            when(function () {
                fakeNgModelCtrl.$viewValue = 'newValue';
                scope.$apply();
            });

            then(function () {
                expect(fakeNgModelCtrl.$setValidity.callCount).toBe(2);
                expect(fakeNgModelCtrl.$setValidity).toHaveBeenCalledWith('foo1', true);
            });
        });
    });
});