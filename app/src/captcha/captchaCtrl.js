angular.module('nemo').controller('CaptchaCtrl', ['$scope', 'Captcha', function ($scope, Captcha) {

    $scope.requestAnother = function () {
        Captcha.getCaptcha($scope.model.actions['request-captcha']).then(function (captchaModel) {
            $scope.captchaModel = captchaModel;
            $scope.updateCaptchaId($scope.captchaModel.getId());
        });
    };

    $scope.getRequestCaptchaCopy = function () {
        return $scope.model.actions["request-captcha"].properties.message;
    };

    $scope.requestAnother();
}]);