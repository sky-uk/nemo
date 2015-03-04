describe('nemo input', function () {
    var fakeCaptcha, captchaField;

    function getFakeCaptchaData(captchaId) {
        return {
            "class": [
                "captcha"
            ],
            "links": [
                {
                    "rel": [
                        "captchaImage"
                    ],
                    "href": "https://fakerango.com/rango/captcha/jpeg/" + captchaId
                },
                {
                    "rel": [
                        "captchaAudio"
                    ],
                    "href": "https://fakerango.com/rango/captcha/wav/" + captchaId
                }
            ],
            "properties": {
                "captchaId": captchaId
            }
        };
    };

    function getCaptchaField() {
        return {
            value: 'asdd',
            name: 'captcha',
            type: 'captcha',
            actions: {
                'request-captcha': {
                    href: 'http://requestanother.com',
                    method: 'POST',
                    properties: {
                        actionsubmit: {
                            code: 'requestcaptcha.submit',
                            message: 'Refresh'
                        }
                    }
                }
            }
        };
    }

    beforeEach(function () {
        module('nemo');
        fakeCaptcha = getFakeCaptchaData('d1d2ca30-2cd6-49f7-ba0d-fd6fb4cde111');
        captchaField = getCaptchaField();
    });

    describe('captchaProvider', function () {
        it('must define the proper model and HTML structure for captcha', inject(function ($httpBackend) {
            var formElement, fieldElement;

            given('backend is setup and directive is compiled', function () {
                $httpBackend.expectPOST('http://requestanother.com').respond(fakeCaptcha);

                formElement = compileDirective(
                    '<form name="foo" nemo-form-handler><nemo-input model="field"></nemo-input></form>',
                    { $rootScope: { field: captchaField } });
            });

            and('I have found the element and flushed the backend', function () {
                fieldElement = angular.element(formElement.children()[0]);
                $httpBackend.flush();
            });

            then('parent captcha setup correctly', function () {
                expect(fieldElement.controller('ngModel').$viewValue).toBe('');
                expect(fieldElement.prop('tagName').toLowerCase()).toBe('div');
                expect(fieldElement.attr('input-captcha')).toBeDefined();
                expect(fieldElement.attr('ng-model')).toBe('model.value');
            });

            and('image tag is setup correctly', function () {
                var imageElement = angular.element(fieldElement[0].getElementsByClassName('nemo-captcha-img'));
                expect(imageElement.prop('tagName').toLowerCase()).toBe("img");
                expect(imageElement.attr('src')).toBe('https://fakerango.com/rango/captcha/jpeg/' + fakeCaptcha.properties.captchaId);
            });

            and('the play element is setup correctly', function () {
                var playElement = angular.element(fieldElement[0].getElementsByClassName('nemo-captcha-play'));
                expect(playElement.prop('tagName').toLowerCase()).toBe("div");
                expect(playElement.attr('ng-click')).toBe('playAudio($event)');
            });

            and('input is setup correctly', function () {
                var inputElement = angular.element(fieldElement[0].getElementsByClassName('nemo-captcha-input'));
                expect(inputElement.prop('tagName').toLowerCase()).toBe("input");
                expect(inputElement.attr('type')).toBe('text');
                expect(inputElement.attr('ng-model')).toBe('model.value');
            });

            and('the refresh captcha is setup correctly', function () {
                var refreshElement = angular.element(fieldElement[0].getElementsByClassName('nemo-captcha-refresh'));
                expect(refreshElement.prop('tagName').toLowerCase()).toBe("div");
                expect(refreshElement.attr('ng-click')).toBe('refreshCaptcha($event)');
                expect(refreshElement.text()).toBe('Refresh');

            });

            and('audio tag is setup correctly', function () {
                var audioElement = angular.element(fieldElement[0].getElementsByClassName('nemo-captcha-audio'));
                expect(audioElement.attr('src')).toBe('https://fakerango.com/rango/captcha/wav/' + fakeCaptcha.properties.captchaId);
                expect(audioElement.text()).toBe('Your browser does not support audio');
            });

        }));
    });

    describe('request another', function () {
        it('should call for another captcha and update the urls for images/audio', inject(function ($httpBackend) {
            var formElement, fieldElement,
                fakeCaptcha2;

            given(function () {
                fakeCaptcha2 = getFakeCaptchaData('sdasdadasd');

                $httpBackend.expectPOST('http://requestanother.com').respond(fakeCaptcha);

                formElement = compileDirective(
                    '<form name="foo" nemo-form-handler><nemo-input model="field"></nemo-input></form>',
                    { $rootScope: { field: captchaField } });
            });

            and('I have found the element, flushed the first post to captcha and expect the next post', function () {
                fieldElement = angular.element(formElement.children()[0]);

                $httpBackend.flush();
                $httpBackend.expectPOST('http://requestanother.com').respond(fakeCaptcha2);
            });

            when('I click on Request Another Captcha link and flush the backend', function () {
                angular.element(fieldElement[0].getElementsByClassName('nemo-captcha-refresh')).triggerHandler('click');
                $httpBackend.flush();
            });

            then('audio tag is setup correctly', function () {
                var audio = fieldElement.find('audio');
                expect(audio[0].getAttribute('src')).toBe('https://fakerango.com/rango/captcha/wav/sdasdadasd');
            });

            and('image tag is setup correctly', function () {
                var image = fieldElement.find('img');
                expect(image[0].getAttribute('src')).toBe('https://fakerango.com/rango/captcha/jpeg/sdasdadasd');
            });
        }));
    });

    describe('update id', function () {
        it('should update the captchaId field via the form controller', inject(function ($httpBackend) {
            var formElement, fieldElement, captchaIdModel;

            given('backend is setup and directive is compiled', function () {

                captchaIdModel =  {
                    type: 'hidden',
                    name: 'captchaId',
                    value: ''
                };

                $httpBackend.expectPOST('http://requestanother.com').respond(fakeCaptcha);

                formElement = compileDirective(
                    '<form name="foo" nemo-form-handler>' +
                    '<nemo-input model="field"></nemo-input>' +
                    '<nemo-input model="field2"></nemo-input>' +
                    '</form>',
                    { $rootScope: { field: captchaField, field2: captchaIdModel } });

            });

            then(function () {
                expect(captchaIdModel.value).toBe('');
            });

            when('I have found the element and flushed the backend', function () {
                fieldElement = angular.element(formElement.children()[0]);
                $httpBackend.flush();
            });

            then(function () {
                expect(captchaIdModel.value).toBe(fakeCaptcha.properties.captchaId);
            });
        }));
    });
});