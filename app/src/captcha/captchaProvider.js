angular.module('nemo').provider('captcha', ['nemoUtilsProvider', function (utilsProvider) {
    return {
        template: '<div class="nemo-captcha">' +
            '<img class="nemo-captcha-img" ng-src="{{captchaModel.getImageUri()}}">' +
            '<div class="nemo-captcha-play" ng-click="playAudio($event)"></div>' +
            '<p class="nemo-captcha-refresh" ng-click="refreshCaptcha($event)">{{getRequestCaptchaCopy()}}</p>' +
            '<input class="nemo-captcha-input" type="text" ng-model="model.value" name="captchaInput" ng-focus="setActiveCaptchaField()" ng-blur="setTouchedCaptchaField()">' +
            '<audio class="nemo-captcha-audio" ng-src="{{captchaModel.getAudioUri()}}">' +
                'Your browser does not support audio' +
            '</audio>' +
        '</div>',
        linkFn: function (scope, element, attrs, formHandlerCtrl, ngModelCtrl) {

            var watcherUnbind = scope.$watch('model.value', function (newVal, oldVal) {
                    if(newVal !== oldVal) {
                        ngModelCtrl.$setDirty();
                        watcherUnbind();
                    }
                });

            scope.updateCaptchaId = function(value) {
                formHandlerCtrl.setFieldValue('captchaId', value);
            };

            scope.playAudio = function ($event) {
                $event.stopPropagation();
                $event.preventDefault();
                element.find('audio')[0].play();
            };

            scope.setActiveCaptchaField = function () {
                formHandlerCtrl.setActiveField(scope.model.name);
            };

            scope.setTouchedCaptchaField = function () {
                ngModelCtrl.$setTouched();
            };
        },
        fieldInterfaceFns: function(scope, element, ngModelCtrl) {
            return {
                setFocus: function () {
                    element.find('input')[0].focus();
                },
                forceServerInvalid: function (errorMessage, errorIndex) {
                    scope.refreshCaptcha();
                    utilsProvider.forceServerInvalid(errorMessage, errorIndex, scope, ngModelCtrl);
                }
            }
        },
        controller: 'CaptchaCtrl',
        $get: {}
    }
}]);