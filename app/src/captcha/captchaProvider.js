angular.module('nemo').provider('captcha', [function () {
    return {
        template: '<div>' +
            '<img ng-src="{{captchaModel.getImageUri()}}">' +
            '<input type="text" ng-model="model.value">' +
            '<a ng-click="requestAnother()">{{getRequestCaptchaCopy()}}</a>' +
            '<a ng-click="playAudio()">Play</a>' +
            '<audio controls style="display: none;" ng-src="{{captchaModel.getAudioUri()}}">' +
                'Audio tag not supported' +
            '</audio>' +
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
            };

            scope.playAudio = function () {
                element.find('audio')[0].play();
            };
        },
        controller: 'CaptchaCtrl',
        $get: {}
    }
}]);