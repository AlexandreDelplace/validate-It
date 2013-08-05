($)(function() {
    $.fn.validateIt = function(param) {
        var _Form = $(this);
        var _Valid = true;
        var _Tmp_value = new Array();

        validatorCreation(param);

        $('.form').each(function() {
            _Form = $(this);
            $('.formSubmit', $(this)).click(function() {
                $('input:not([type=button]), .form select, textarea, .checkList', _Form).each(function() {
                    var _Valid = true;
                    var valid = true;
                    if ($(this).attr('data-form') != null) {
                        var el = $(this);
                        var data = el.attr('data-form').split(" ");
                        for (var x in data) {
                            if (valid) {
                                var obj = window['vi_' + data[x].replace(/^\s+|\s+$/g, '')];
                                if (typeof obj == "object") {
                                    if (typeof obj.process == "function") {
                                        if (el.hasClass('error')) {
                                            el.next().remove();
                                            el.removeClass('error');
                                        }
                                        if ($(this).hasClass("checkList")) {
                                            console.log($(this));
                                            obj._Value = new Array();
                                            $('input[type=checkbox]', $(this)).filter(function() {
                                                return this.checked
                                            }).each(function() {
                                                obj._Value.push($(this).val());
                                            });
                                            obj.reset();
                                            obj.requireOptionalTest(obj);
                                        } else {
                                            switch (obj._Name) {
                                                case 'password':
                                                    _Tmp_value['password'] = el.val();
                                                    break;
                                                case 'passwordConfirm':
                                                    passwordConfirm._Conf_equality = _Tmp_value['password'];
                                                    break;
                                                default:
                                                    break;
                                            }
                                            obj._Value = el.val().replace(/^\s+|\s+$/g, '');
                                            obj.process();
                                        }
                                        if (!obj._Valid) {
                                            valid = false;
                                            _Valid = false;
                                            el.addClass('error');
                                            el.after('<small class="error">' + obj._Message + '</small>');
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                if (_Valid)
                    _Form.submit();
            });
        });
        
        function onChange() {
            var valid = true;
            if ($(this).attr('data-form') != null) {
                var el = $(this);
                var data = el.attr('data-form').split(" ");
                for (var x in data) {
                    if (valid) {
                        var obj = window["vi_" + data[x].replace(/^\s+|\s+$/g, '')];
                        if (typeof obj == "object") {
                            if (typeof obj.process == "function") {
                                if (el.hasClass('error')) {
                                    el.next().remove();
                                    el.removeClass('error');
                                }
                                if ($(this).hasClass("checkList")) {
                                    obj._Value = new Array();
                                    $('input[type=checkbox]', $(this)).filter(function() {
                                        return this.checked
                                    }).each(function() {
                                        obj._Value.push($(this).val());
                                    });
                                    obj.reset();
                                    obj.requireOptionalTest(obj);
                                } else {
                                    obj._Value = el.val().replace(/^\s+|\s+$/g, '');
                                    obj.process();
                                }
                                if (!obj._Valid) {
                                    valid = false;
                                    _Valid = false;
                                    el.addClass('error');
                                    el.after('<small class="error">' + obj._Message + '</small>');
                                }
                            }
                        }
                    }
                }
            }
        };
        
        $('input:not([type=button]), select, textarea, .checkList', _Form).on('onBlur keyup', onChange);
        $('.checkList', _Form).on('click', onChange);
    };
    

    var validatorCreation = function(param) {
        for (var name in param) {
            window["vi_" + name] = validator.clone(name);
            var obj = window["vi_" + name];
            for (var fct in param[name]) {
                if (fct == "test") {
                    obj.requireOptionalTest = param[name][fct];
                } else {
                    obj._Functions.push("require" + fct[0].toUpperCase() + fct.slice(1));
                    if (param[name][fct].message != undefined)
                        obj._Messages[fct] = param[name][fct].message;
                    if (param[name][fct].conf != undefined)
                        obj._Conf[fct] = param[name][fct].conf;
                }
            }
        }
    };

    $('.form').validateIt({
        check: {
            test: function(self) {
                if (self._Value.indexOf('lol') != -1) {
                    self._Valid = false;
                    self._Message = "loelsfejijofseijfoesojf";
                }
            }
        },
        prenom: {
            mismatch: {
                conf: ["Jean", "Bernard"],
                message: "Le prénom ne peut être égal à Jean ou Bernard"
            },
            field: {
                message: "Veuillez entrer votre prénom"
            },
            test: function(self) {
                var valid = true;
                valid = (self._Value != "toto");
                if (!valid) {
                    self._Valid = false;
                    self._Message = "Ce champ est invalide";
                }

            }
        }
    });


});

