Namespace.use('jasmine.grammar.GWT.*');

compileController = function(ctrlName, customDependencies) {

    var ctrl = null, scope, dependencies;

    inject(function(_$rootScope_, _$controller_) {
        scope = _$rootScope_.$new();
        dependencies = { $scope: scope };
        angular.extend(dependencies, customDependencies);
        ctrl = _$controller_(ctrlName, dependencies);
    });

    return ctrl;
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