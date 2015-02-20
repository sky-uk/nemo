angular.module('nemo').provider('captcha', [function () {
    return {
        template: '<div>' +
            '<img class="nemo-captcha-img" ng-src="{{captchaModel.getImageUri()}}">' +
            '<div class="nemo-captcha-play" ng-click="playAudio($event)"></div>' +
            '<input class="nemo-captcha-input" type="text" ng-model="model.value">' +
            '<div class="nemo-captcha-refresh" ng-click="refreshCaptcha($event)">{{getRequestCaptchaCopy()}}</div>' +
            '<audio controls class="nemo-captcha-audio" ng-src="{{captchaModel.getAudioUri()}}">' +
                'Your browser does not support audio' +
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

            scope.playAudio = function ($event) {
                $event.stopPropagation();
                $event.preventDefault();
                element.find('audio')[0].play();
            };
        },
        controller: 'CaptchaCtrl',
        $get: {}
    }
}]);