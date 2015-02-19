angular.module('nemo').provider('captcha', [function () {
    return {
        template: '<div>' +
            '<img class="nemo-captcha-img" ng-src="{{captchaModel.getImageUri()}}">' +
            '<div class="nemo-captcha-play-btn" ng-click="playAudio($event)"></div>' +
            '<input type="text" ng-model="model.value">' +

            '<div class="nemo-captcha-refresh-btn" ng-click="refreshCaptcha($event)">{{getRequestCaptchaCopy()}}</div>' +
            '<audio controls class="nemo-captcha-audio-controls" ng-src="{{captchaModel.getAudioUri()}}">' +
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