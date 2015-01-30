var TESTDATA = TESTDATA || {};

TESTDATA.validation = {
    required: function () {
        return {
            "type": "required",
            "rules": [
                {
                    "value": true,
                    "code": "foo.blank",
                    "message": "Please enter something"
                }
            ]
        };
    },
    minlength: function (minLength) {
        return {
            "type": "minlength",
            "rules": [
                {
                    "value": minLength,
                    "code": "foo.size.toosmall",
                    "message": "Please type a longer text"
                }
            ]
        };
    },
    maxlength: function (maxLength) {
        return {
            "type": "maxlength",
            "rules": [
                {
                    "value": maxLength,
                    "code": "foo.size.toobig",
                    "message": "Please type a shorter text"
                }
            ]
        };
    },
    email: function () {
        return {
            "type" : "email",
            "rules" :
                [
                    {
                        "value" : true,
                        "code" : "foo.email.invalid",
                        "message" : "Please enter a valid email"
                    }
                ]
        };
    },
    mustbetrue: function () {
        return {
            "type" : "mustbetrue",
            "rules" :
                [
                    {
                        "value" : true,
                        "code" : "foo.notequal",
                        "message" : "The value must be true"
                    }
                ]
        };
    },
    inlist: function () {
        return {
            "type" : "inlist",
            "rules" :
                [
                    {
                        "value" :
                            [
                                "foo",
                                "bar",
                                "bla"
                            ],
                        "code" : "foo.invalid",
                        "message" : "Please select a valid value"
                    }
                ]
        }
    },
    pattern: function () {
        return {
            "type" : "pattern",
            "rules" :
                [
                    {
                        "value" : "^[a-zA-Z \\'-]+$",
                        "code" : "foo.invalid.characters",
                        "message" : "Please type just letters and spaces"
                    },
                    {
                        "value" : "[^-\\']$",
                        "code" : "foo.invalid.characters.startorend",
                        "message" : "Please type a letter only at start and end"
                    }
                ]
        }
    },
    notpattern: function () {
        return {
            "type" : "notpattern",
            "rules" :
                [
                    {
                        "value" : "^[0-5]*$",
                        "code" : "foo.invalid.smallNumbers",
                        "message" : "Please type bigger numbers"
                    },
                    {
                        "value" : "^[5-8]*$",
                        "code" : "foo.invalid.bigNumbers",
                        "message" : "Please type smaller numbers"
                    }
                ]
        }
    },
    mustnotcontain: function () {
        return {
            "type" : "mustnotcontain",
            "rules":
                [
                    {
                        "value" : "username",
                        "code" : "foo.contains.username",
                        "message" : "Foo cant contain username"
                    }
                ]
        }
    },
    mustmatch: function () {
        return {
            "type" : "mustmatch",
            "rules":
                [
                    {
                        "value" : "username",
                        "code" : "foo.must.match.username",
                        "message" : "Foo must match username"
                    }
                ]
        }
    }
};