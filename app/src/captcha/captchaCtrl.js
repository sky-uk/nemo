angular.module('nemo').controller('CaptchaCtrl', ['$scope', 'Captcha', 'nemoUtils', function ($scope, Captcha, utils) {

    function getCaptchaInfo() {
        $scope.model.value = '';
        return Captcha.getCaptcha($scope.model.action).then(function (captchaModel) {
            $scope.captchaModel = captchaModel;
            $scope.updateCaptchaId($scope.captchaModel.getId());
        });
    }

    var debouncedGetCaptchaInfo = utils.debounce(getCaptchaInfo, 1000, true);

    $scope.refreshCaptcha = function ($event) {
        if ($event) {
            $event.stopPropagation();
            $event.preventDefault();
        }
        return debouncedGetCaptchaInfo();
    };

    $scope.getRequestCaptchaCopy = function () {
        return $scope.model.action.properties.actionsubmit.message;
    };

    getCaptchaInfo();
}]);