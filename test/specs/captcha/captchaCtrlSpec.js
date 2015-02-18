describe('captcha ctrl', function () {
    var fakeCaptcha, captchaModel;

    beforeEach(function () {
        module('nemo');
        captchaModel =  {
            value: 'asdd',
            name: 'captcha',
            type: 'captcha',
            actions: {
                'request-captcha': {
                    href: 'http://requestanother.com',
                    method: 'POST',
                    properties: {
                        code: 'requestcaptcha.submit',
                        message: 'Captcha message'
                    }
                }
            }
        };
    });

    it('should set the captchaModel to undefined when fetching a new one to force the browser to see the new audio tag',
        inject(function ($httpBackend) {
            var scope;
            given(function () {
                $httpBackend.expectPOST('http://requestanother.com').respond({properties: {}});
                scope = compileController('CaptchaCtrl', {model: captchaModel, updateCaptchaId: jasmine.createSpy()});
            });

            when('the backend responds', function () {
                $httpBackend.flush();
            });

            then('the captchaModel should be defined', function () {
                expect(scope.captchaModel).toBeDefined();
            });

            when('another captcha is requested', function () {
                $httpBackend.expectPOST('http://requestanother.com').respond({properties: {}});
                scope.requestAnother();
            });

            then('the model should be undefined', function () {
                expect(scope.captchaModel).toBeUndefined();
            });

            when('the backend responds', function () {
                $httpBackend.flush();
            });

            then('the captchaModel should be defined again', function () {
                expect(scope.captchaModel).toBeDefined();
            });
        })
    );
});