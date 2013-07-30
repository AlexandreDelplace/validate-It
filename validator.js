var validator = {
	
    _Name: "",
    _Value: null,
    _Message: "",
    _Valid: true,

    _Functions: [],
	_Message: [],
	
    _Message_maxLength: "Ce champ possède trop de caractères",
    _Message_minLength: "Ce champ ne possède pas assez de caractères",
    _Message_regex: "Ce champ n'est pas sous le bon format",
    _Message_require: "Veuillez remplir ce champ",
    _Message_mismatch: "Ce champ n'est pas correct",
    _Message_equality: "Ce champ n'est pas correct",

    _Conf_equality: "",
    _Conf_length: [3, 0],
    _Conf_regex: "",
    _Conf_mismatch: [],

    clone: function (name) {
        var obj = $.extend({}, validator);
        obj._Name = name;
        return obj;
    },

    process: function () {
        this._Message = "";
        this._Valid = true;
        for (var x in this._Functions) {
            eval('this.' + this._Functions[x])(this);
            if (!this._Valid)
                return false;
        }
        this.requireOptionalTest(this);
    },
    requireOptionalTest: function (self) {
    },
    requireEquality: function (self) {
        if (self._Value != self._Conf_equality) {
            self._Valid = false;
            self._Message = self._Message_equality;
        }
    },
    requireMismatch: function (self) {
        for (var x in self._Conf_mismatch) {
            if (self._Value == self._Conf_mismatch[x]) {
                self._Valid = false;
                self._Message = self._Message_mismatch;
            }
        }
    },
    requireRegex: function (self) {
        var regex = new RegExp(self._Conf_regex, "g");
        if (!regex.test(self._Value)) {
            self._Valid = false;
            self._Message = self._Message_regex;
        }
    },
    requireField: function (self) {
        if (self._Value.length == 0) {
            self._Valid = false;
            self._Message = self._Message_require
        }
    },
    requireLength: function (self) {
        if (self._Value.length < self._Conf_length[0]) {
            self._Message = self._Message_minLength;
            self._Valid = false;
        }
        if (self._Conf_length[1] != 0 && self._Value.length > self._Conf_length[1]) {
            self._Message = self._Message_maxLength;
            self._Valid = false;
        }
    }
	
}

var vi_alphanumeric = validator.clone("alphanumeric");
var vi_alpha = validator.clone("alpha");
var vi_numeric = validator.clone("numeric");
var vi_email = validator.clone("email");
var vi_phoneFR = validator.clone("phoneFR");
var vi_required = validator.clone("required");

var vi_password = validator.clone("password");
var vi_passwordConfirm = validator.clone("passwordConfirm");

/******************* Définition des paramètres *******************/

vi_alphanumeric._Conf_regex = '^[a-zA-Z0-9àáâãäåçèéêëìíîïğòóôõöùúûüıÿ-]*$';
vi_alphanumeric._Message_regex = 'Ce champ ne doit contenir que des caractères alphanumériques';
vi_alphanumeric._Functions = ['requireRegex'];

vi_alpha._Conf_regex = '^[a-zA-Zàáâãäåçèéêëìíîïğòóôõöùúûüıÿ-]*$';
vi_alpha._Message_regex = 'Ce champ ne doit contenir que des caractères alphabétiques';
vi_alpha._Functions = ['requireRegex'];

vi_numeric._Conf_regex = '^[0-9]*$';
vi_numeric._Message_regex = 'Ce champ ne doit contenir que des caractères numériques';
vi_numeric._Functions = ['requireRegex'];

vi_email._Conf_regex = '^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$';
vi_email._Message_regex = 'Veuillez entrer un adresse email valide';
vi_email._Functions = ['requireRegex'];

vi_phoneFR._Conf_regex = '^[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}$';
vi_phoneFR._Message_regex = 'Veuillez entrer un numéro de téléphone valide';
vi_phoneFR._Functions = ['requireRegex'];

vi_required._Functions = ['requireField'];

vi_password._Conf_regex = '[A-Za-zàáâãäåçèéêëìíîïğòóôõöùúûüıÿ-].*[0-9]|[0-9].*[A-Za-zàáâãäåçèéêëìíîïğòóôõöùúûüıÿ-]$';
vi_password._Message_regex = "Le mot de passe doit contenir au moins un chiffre et une lettre";
vi_password._Functions = ['requireRegex'];

vi_passwordConfirm._Message_equality = "Veuillez entrer le même mot de passe";
vi_passwordConfirm._Functions = ['requireEquality'];

