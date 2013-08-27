($)(function() {
    $.fn.validateIt = function(param) {
	var _Form = $(this);
	var _Valid = true;
	var _Tmp_value = new Array();
	var _Submit = new Object();
	_Submit.process = function(_Form) {
	    _Form.unbind();
	    _Form.submit();
	};

	validatorCreation(param, _Submit);

	$('.formSubmit', $(this)).click(function() {
	    var _Valid = true;
	    $('input:not([type=button]), .form select, textarea, .checkList', _Form).each(function() {
		var valid = true;
		if ($(this).attr('data-form') != null) {
		    var el = $(this);
		    var data = el.attr('data-form').split(" ");
		    for (var x in data) {
			var obj = window['vi_' + data[x].replace(/^\s+|\s+$/g, '')];
			if (valid && typeof obj == "object" && typeof obj.process == "function") {
			    if (el.hasClass('error')) {
				el.next().remove();
				el.removeClass('error');
			    }
			    if ($(this).hasClass("groupValidator")) {
				obj._Value = new Array();
				$('input[type=checkbox]', $(this)).filter(function() {
				    return this.checked
				}).each(function() {
				    obj._Value.push($(this).val());
				});
				$('input:not([type=checkbox])', $(this)).each(function() {
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
					vi_passwordConfirm._Conf_equality = _Tmp_value['password'];
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
	    });
	    if (_Valid) {
		_Submit.process(_Form);
	    } else {
		_Form.on("submit", function(e) {
		    e.preventDefault();
		});
	    }
	});

	function onChange(e) {
	    if (e.keyCode == 13) {
		$('.formSubmit', _Form).trigger('click');
	    } else {
		var valid = true;
		var el = ($(this).attr('data-form') !== undefined) ? $(this) : $(this).parent('.groupValidator');
		var data = el.attr('data-form').split(" ");
		for (var x in data) {
		    var obj = window["vi_" + data[x].replace(/^\s+|\s+$/g, '')];
		    if (valid && data[x] != "passwordConfirm" && typeof obj == "object" && typeof obj.process == "function") {
			if (el.hasClass('error')) {
			    el.next().remove();
			    el.removeClass('error');
			}
			if (el.hasClass("groupValidator")) {
			    obj._Value = new Array();
			    $('input[type=checkbox]', el).filter(function() {
				return this.checked
			    }).each(function() {
				obj._Value.push($(this).val());
			    });
			    $('input:not([type=checkbox])', el).each(function() {
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
	;

	$('input:not([type=button]), select, textarea', _Form).filter(function() {
	    return $(this).attr('data-form') !== undefined;
	}).on('keyup change', onChange);
	$('.groupValidator input[type=checkbox]', _Form).on('click', onChange);
	$('.groupValidator input:not([type=checkbox])', _Form).on('keyup change', onChange);
	_Form.on("submit", function(e) {
	    e.preventDefault();
	});
    };

    var validatorCreation = function(param, _Submit) {
	for (var name in param) {
	    if (name == "submit") {
		_Submit.process = param[name];
	    } else {
		window["vi_" + name] = validator.clone(name);
		var obj = window["vi_" + name];
		for (var fct in param[name]) {
		    if (fct == 'test') {
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
	}
    };
});

/******************* Class validator *******************/

var validator = {
    _Name: "",
    _Value: null,
    _Message: "",
    _Valid: true,
    _Functions: [],
    _Messages: new Array(),
    _Conf: new Array(),
    init: function() {
	this._Messages["minLength"] = "Ce champ ne possède pas assez de caractères";
	this._Messages["maxLength"] = "Ce champ possède trop de caractères";
	this._Messages["regex"] = "Ce champ n'est pas sous le bon format";
	this._Messages["field"] = "Veuillez remplir ce champ";
	this._Messages["mismatch"] = "Ce champ n'est pas correct";
	this._Messages["equality"] = "Ce champ n'est pas correct";

	this._Conf["equality"] = "";
	this._Conf["minLength"] = 0;
	this._Conf["maxLength"] = 32;
	this._Conf["mismatch"] = new Array();
    },
    clone: function(name) {
	var obj = $.extend(true, {}, validator);
	obj._Name = name;
	obj.init();
	return obj;
    },
    reset: function() {
	this._Message = "";
	this._Valid = true;
    },
    process: function() {
	this.reset();
	for (var x in this._Functions) {
	    eval('this.' + this._Functions[x])(this);
	    if (!this._Valid)
		return false;
	}
	this.requireOptionalTest(this);
    },
    requireOptionalTest: function(self) {
    },
    requireEquality: function(self) {
	if (self._Value != self._Conf["equality"]) {
	    self._Valid = false;
	    self._Message = self._Messages["equality"];
	}
    },
    requireMismatch: function(self) {
	for (var x in self._Conf.mismatch) {
	    if (self._Value == self._Conf["mismatch"][x]) {
		self._Valid = false;
		self._Message = self._Messages["mismatch"];
	    }
	}
    },
    requireRegex: function(self) {
	var regex = new RegExp(self._Conf["regex"], "g");
	if (!regex.test(self._Value)) {
	    self._Valid = false;
	    self._Message = self._Messages["regex"];
	}
    },
    requireField: function(self) {
	if (self._Value.length == 0) {
	    self._Valid = false;
	    self._Message = self._Messages["field"];
	}
    },
    requireMinLength: function(self) {
	if (self._Value.length < self._Conf["minLength"]) {
	    self._Message = self._Messages["minLength"];
	    self._Valid = false;
	}
    },
    requireMaxLength: function(self) {
	if (self._Value.length > self._Conf["maxLength"]) {
	    self._Message = self._Messages["maxLength"];
	    self._Valid = false;
	}
    }

};

/******************* Default validators *******************/

var vi_alphanumeric = validator.clone("alphanumeric");
var vi_alpha = validator.clone("alpha");
var vi_numeric = validator.clone("numeric");
var vi_email = validator.clone("email");
var vi_phoneFR = validator.clone("phoneFR");
var vi_required = validator.clone("required");

var vi_password = validator.clone("password");
var vi_passwordConfirm = validator.clone("passwordConfirm");

/******************* Default parameters *******************/

vi_alphanumeric._Conf["regex"] = '^[a-zA-Z0-9ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ-]*$';
vi_alphanumeric._Messages["regex"] = 'Ce champ ne doit contenir que des caractères alphanumériques';
vi_alphanumeric._Functions = ['requireRegex'];

vi_alpha._Conf["regex"] = '^[a-zA-ZÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ-]*$';
vi_alpha._Messages["regex"] = 'Ce champ ne doit contenir que des caractères alphabétiques';
vi_alpha._Functions = ['requireRegex'];

vi_numeric._Conf["regex"] = '^[0-9]*$';
vi_numeric._Messages["regex"] = 'Ce champ ne doit contenir que des caractères numériques';
vi_numeric._Functions = ['requireRegex'];

vi_email._Conf["regex"] = '^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$';
vi_email._Messages["regex"] = 'Veuillez entrer un adresse email valide';
vi_email._Functions = ['requireRegex'];

vi_phoneFR._Conf["regex"] = '^[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}$';
vi_phoneFR._Messages["regex"] = 'Veuillez entrer un numéro de téléphone valide';
vi_phoneFR._Functions = ['requireRegex'];

vi_required._Functions = ['requireField'];

vi_password._Conf["regex"] = '[A-Za-zÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ-].*[0-9]|[0-9].*[A-Za-zÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ-]$';
vi_password._Messages["regex"] = "Le mot de passe doit contenir au moins un chiffre et une lettre";
vi_password._Functions = ['requireRegex'];

vi_passwordConfirm._Messages["equality"] = "Veuillez entrer le même mot de passe";
vi_passwordConfirm._Functions = ['requireEquality'];

