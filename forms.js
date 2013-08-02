($)(function() {
    $.fn.validateIt = function(param) {
        var _Form = $(this);
        var _Valid = true;
        var _Tmp_value = new Array();

        validatorCreation(param);

        $('.form').each(function() {
            _Form = $(this);
            $('.formSubmit', $(this)).click(function() {
                $('input:not([type=button]), .form select', _Form).each(function() {
                    var valid = true;
                    if ($(this).attr('data-form') != null) {
                        var el = $(this);
                        var data = el.attr('data-form').split(" ");
                        for (var x in data) {
                            if (valid) {
                                var obj = window['vi_' + data[x].replace(/^\s+|\s+$/g, '')];
                                if (typeof obj == "object") {
                                    if (typeof obj.process == "function") {
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
                                        if (el.hasClass('error')) {
                                            el.next().remove();
                                            el.removeClass('error');
                                        }
                                        obj._Value = el.val().replace(/^\s+|\s+$/g, '');
                                        obj.process();
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
        $('input:not([type=button]), .form select', _Form).on('onBlur keyup', function() {
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
                                obj._Value = el.val().replace(/^\s+|\s+$/g, '');
                                obj.process();
                                if (!obj._Valid) {
                                    valid = false;
                                    el.addClass('error');
                                    el.after('<small class="error">' + obj._Message + '</small>');
                                }
                            }
                        }
                    }
                }
            }
        });
    };

    validatorCreation = function(param) {
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
        lol: {
            mismatch: {
              conf: ["lol","fuck"],
              message: "lol"
            },
            field: {
                message: "fsefesfefs"
            },
            test: function(self) {
                //alert('lol');
            }
        }
    });
});

