var express = require('express'),
    app = express(),
    captchaBlob1 = {
        "class": [
            "captcha"
        ],
        "links": [
            {
                "rel": [
                    "captchaImage"
                ],
                "href": "http://0.0.0.0:3333/app/sample/captcha1.jpeg"
            },
            {
                "rel": [
                    "captchaAudio"
                ],
                "href": "http://0.0.0.0:3333/app/sample/captcha.wav"
            }
        ],
        "properties": {
            "captchaId": "d1d2ca30-2cd6-49f7-ba0d-fd6fb4cde111"
        }
    },
    captchaBlob2 = {
        "class": [
            "captcha"
        ],
        "links": [
            {
                "rel": [
                    "captchaImage"
                ],
                "href": "http://0.0.0.0:3333/app/sample/captcha2.jpeg"
            },
            {
                "rel": [
                    "captchaAudio"
                ],
                "href": "http://0.0.0.0:3333/app/sample/captcha.wav"
            }
        ],
        "properties": {
            "captchaId": "anotherId"
        }
    },
    responseNo = 0;

app.use(express.static(__dirname + '/'));

app.post('/captcha', function(req, res) {
    res.setHeader('Content-Type', 'application/vnd.siren+json;charset=UTF-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    var captchaData;
    if (responseNo) {
        captchaData = captchaBlob1;
        responseNo++;
    } else {
        captchaData = captchaBlob2;
        responseNo--;
    }
    res.end(JSON.stringify(captchaData));
});
module.exports = app;