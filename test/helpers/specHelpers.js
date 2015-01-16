Namespace.use('jasmine.grammar.GWT.*');

compileController = function(ctrlName, dependencies) {

    var ctrl, scope;

    inject(function(_$rootScope_, _$controller_) {
        scope = _$rootScope_.$new();

        angular.extend(scope, dependencies);

        ctrl = _$controller_(ctrlName, { $scope: scope });
    });

    return scope;
};

compileDirective = function(_el_, _config_) {

    var compiledEl,
        config = _config_ || {};

    inject(function($rootScope, $compile) {

        angular.extend($rootScope, config.$rootScope || {});

        compiledEl = $compile(angular.element(_el_))($rootScope);

        $rootScope.$digest();
    });
    return compiledEl;
};