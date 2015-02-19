describe('nemo input', function () {
    var fakeCaptcha, captchaModel;

    beforeEach(function () {
        module('nemo');
        fakeCaptcha = {
            "class": [
                "captcha"
            ],
            "links": [
                {
                    "rel": [
                        "captchaImage"
                    ],
                    "href": "https://fakerango.com/rango/captcha/jpeg/d1d2ca30-2cd6-49f7-ba0d-fd6fb4cde111"
                },
                {
                    "rel": [
                        "captchaAudio"
                    ],
                    "href": "https://fakerango.com/rango/captcha/wav/d1d2ca30-2cd6-49f7-ba0d-fd6fb4cde111"
                }
            ],
            "properties": {
                "captchaId": "d1d2ca30-2cd6-49f7-ba0d-fd6fb4cde111"
            }
        };

        captchaModel =  {
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
                            message: 'Captcha message'
                        }
                    }
                }
            }
        };
    });

    describe('captchaProvider', function () {
        it('must define the proper model and HTML structure for captcha', inject(function ($httpBackend) {
            var formElement, fieldElement;

            given('backend is setup and directive is compiled', function () {
                $httpBackend.expectPOST('http://requestanother.com').respond(fakeCaptcha);

                formElement = compileDirective(
                    '<form name="foo" form-handler><nemo-input model="field"></nemo-input></form>',
                    { $rootScope: { field: captchaModel } });
            });

            and('I have found the element and flushed the backend', function () {

                fieldElement = angular.element(formElement.children()[0]);

                $httpBackend.flush();
            });

            then('parent captcha setup correctly', function () {
                expect(fieldElement.controller('ngModel').$viewValue).toBe('');
                expect(fieldElement.prop('tagName').toLowerCase()).toBe('div');
                expect(fieldElement.attr('input-captcha')).not.toBeUndefined();
                expect(fieldElement.attr('ng-model')).toBe('model.value');
            });

            and('input is setup with ngmodel', function () {
                var input = fieldElement.find('input');
                expect(input[0].getAttribute('type')).toBe('text');
                expect(input[0].getAttribute('ng-model')).toBe('model.value');
            });

            and('audio tag is setup correctly', function () {
                var audio = fieldElement.find('audio');
                expect(audio[0].getAttribute('src')).toBe('https://fakerango.com/rango/captcha/wav/d1d2ca30-2cd6-49f7-ba0d-fd6fb4cde111');
            });

            and('request another tag is setup correctly', function () {
                var requestAnother = fieldElement.find('a');
                expect(requestAnother[0].getAttribute('ng-click')).toBeDefined();
            });

            and('image tag is setup correctly', function () {
                var image = fieldElement.find('img');
                expect(image[0].getAttribute('src')).toBe('https://fakerango.com/rango/captcha/jpeg/d1d2ca30-2cd6-49f7-ba0d-fd6fb4cde111');
            });
        }));
    });

    describe('request another', function () {
        it('should call for another captcha and update the urls for images/audio', inject(function ($httpBackend) {
            var formElement, fieldElement,
                fakeCaptcha2;

            given(function () {
                fakeCaptcha2 = {
                    "class": [
                        "captcha"
                    ],
                    "links": [
                        {
                            "rel": [
                                "captchaImage"
                            ],
                            "href": "https://fakerango.com/rango/captcha/jpeg/sdasdadasd"
                        },
                        {
                            "rel": [
                                "captchaAudio"
                            ],
                            "href": "https://fakerango.com/rango/captcha/wav/sdasdadasd"
                        }
                    ],
                    "properties": {
                        "captchaId": "sdasdadasd"
                    }
                };
                $httpBackend.expectPOST('http://requestanother.com').respond(fakeCaptcha);

                formElement = compileDirective(
                    '<form name="foo" form-handler><nemo-input model="field"></nemo-input></form>',
                    { $rootScope: { field: captchaModel } });
            });

            and('I have found the element, flushed the first post to captcha and expect the next post', function () {
                fieldElement = angular.element(formElement.children()[0]);

                $httpBackend.flush();
                $httpBackend.expectPOST('http://requestanother.com').respond(fakeCaptcha2);
            });

            when('I click on Request Another Captcha link and flush the backend', function () {
                fieldElement.find('a').triggerHandler('click');
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
        it('should update the captchId field via the form controller', inject(function ($httpBackend) {
            var formElement, fieldElement, captchaIdModel;

            given('backend is setup and directive is compiled', function () {
                captchaIdModel =  {
                    type: 'hidden',
                    name: 'captchaId',
                    value: ''
                };
                $httpBackend.expectPOST('http://requestanother.com').respond(fakeCaptcha);
                formElement = compileDirective(
                    '<form name="foo" form-handler>' +
                    '<nemo-input model="field"></nemo-input>' +
                    '<nemo-input model="field2"></nemo-input>' +
                    '</form>',
                    { $rootScope: { field: captchaModel, field2: captchaIdModel } });

            });

            when('I have found the element and flushed the backend', function () {
                fieldElement = angular.element(formElement.children()[0]);
                $httpBackend.flush();

            });

            then(function () {
                expect(captchaIdModel.value).toBe('d1d2ca30-2cd6-49f7-ba0d-fd6fb4cde111');
            });
        }));
    })
});