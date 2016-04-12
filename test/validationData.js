var TESTDATA = TESTDATA || {};

TESTDATA.validation = {
    required: function () {
        return {
            "type": "required",
            "rules": [
                {
                    "value": true,
                    "id": "foo.blank",
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
                    "id": "foo.size.toosmall",
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
                    "id": "foo.size.toobig",
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
                        "id" : "foo.email.invalid",
                        "message" : "Please enter a valid email"
                    }
                ]
        };
    },
    mustbeequal: function () {
        return {
            "type" : "mustbeequal",
            "rules" :
                [
                    {
                        "value" : true,
                        "id" : "foo.notequal",
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
                        "id" : "foo.invalid",
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
                        "id" : "foo.invalid.characters",
                        "message" : "Please type just letters and spaces"
                    },
                    {
                        "value" : "[^-\\']$",
                        "id" : "foo.invalid.characters.startorend",
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
                        "id" : "foo.invalid.smallNumbers",
                        "message" : "Please type bigger numbers"
                    },
                    {
                        "value" : "^[5-8]*$",
                        "id" : "foo.invalid.bigNumbers",
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
                        "id" : "foo.contains.username",
                        "message" : "Foo cant contain username"
                    }
                ]
        }
    },

    mustnotcontainmatchedgroup: function () {
        return {
            "type" : "mustnotcontainmatchedgroup",
            "rules":
                [
                    {
                        "value" : {"field": "username", match: "([\\w]{2,})"},
                        "id" : "foo.contains.username",
                        "message" : "Password cant contain username"
                    },
                    {
                        "value" : {"field": "email", match: "(.{2,})@"},
                        "id" : "foo.contains.email",
                        "message" : "Password cant contain email"
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
                        "id" : "foo.must.match.username",
                        "message" : "Foo must match username"
                    }
                ]
        }
    },
    mustmatchcaseinsensitive: function () {
        return {
            "type" : "mustmatchcaseinsensitive",
            "rules":
                [
                    {
                        "value" : "username",
                        "id" : "foo.must.match.username",
                        "message" : "Foo must match username"
                    }
                ]
        }
    },
    dependentpattern: function () {
        return {
            "type" : "dependentpattern",
            "rules":
                [
                    {
                        "value" : "username",
                        "patterns" : {
                            "fooUsername": "^[0-9]{1}$",
                            "bob": "^[a-z]+$"
                        },
                        "id" : "foo.dependent.pattern.username",
                        "message" : "Foo is not valid"
                    }
                ]
        }
    },
    dependentrequired: function () {
        return {
            "type" : "dependentrequired",
            "rules":
                [
                    {
                        "value" : "username",
                        "when" : [
                            "fooUsername"
                        ],
                        "id" : "foo.dependent.required.username",
                        "message" : "Foo is required"
                    }
                ]
        }
    },
    usernameserver: function () {
        return {
            "type" : "server",
            "rules":
                [
                    {
                        "message": "Sorry, someone already has that username",
                        "value": null,
                        "id": "username.taken"
                    }
                ]
        }
    }
};