angular.module('nemo').provider('captcha', [function () {
    return {
        template: '<div>' +
            '<img ng-src="{{captchaModel.getImageUri()}}">' +
            '<input type="text" ng-model="model.value">' +
            '<a ng-click="requestAnother()">{{getRequestCaptchaCopy()}}</a>' +
            '<audio controls ng-if="captchaModel"><source ng-src="{{captchaModel.getAudioUri()}}"></audio>' +
        '</div>',
        linkFn: function (scope, element, attrs, controllers) {
            var ngModelController = controllers[0],
                formHandler = controllers[1],
                watcherUnbind = scope.$watch('model.value', function (newVal, oldVal) {
                    if(newVal !== oldVal) {
                        ngModelController.$setDirty();
                        watcherUnbind();
                    }
                });

            scope.updateCaptchaId = function(value) {
                formHandler.setFieldValue('captchaId', value);
            }
        },
        controller: 'CaptchaCtrl',
        $get: {}
    }
}]);