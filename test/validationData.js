var TESTDATA = TESTDATA || {};

TESTDATA.validation = {
    required: function () {
        return {
            "type": "required",
            "attrName": "required",
            "rules": [
                {
                    "value": true,
                    "id": "foo.blank",
                    "message": "Please enter something"
                }
            ]
        };
    },
    minLength: function (minLength) {
        return {
            "type": "minLength",
            "attrName": "min-length",
            "rules": [
                {
                    "value": minLength,
                    "id": "foo.size.toosmall",
                    "message": "Please type a longer text"
                }
            ]
        };
    },
    maxLength: function (maxLength) {
        return {
            "type": "maxLength",
            "attrName": "max-length",
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
            "attrName": "email",
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
    mustBeEqual: function () {
        return {
            "type" : "mustBeEqual",
            "attrName": "must-be-equal",
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
    inList: function () {
        return {
            "type" : "inList",
            "attrName": "in-list",
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
            "attrName": "pattern",
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
    notPattern: function () {
        return {
            "type" : "notPattern",
            "attrName": "not-pattern",
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
    mustNotContain: function () {
        return {
            "type" : "mustNotContain",
            "attrName": "must-not-contain",
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
    mustMatch: function () {
        return {
            "type" : "mustMatch",
            "attrName": "must-match",
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
    mustMatchCaseInsensitive: function () {
        return {
            "type" : "mustMatchCaseInsensitive",
            "attrName": "must-match-case-insensitive",
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
    dependentPattern: function () {
        return {
            "type" : "dependentPattern",
            "attrName": "dependent-pattern",
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
    dependentRequired: function () {
        return {
            "type" : "dependentRequired",
            "attrName": "dependent-required",
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
    usernameServer: function () {
        return {
            "type" : "server",
            "attrName": "server",
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