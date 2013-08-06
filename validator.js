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


var vi_alphanumeric = validator.clone("alphanumeric");
var vi_alpha = validator.clone("alpha");
var vi_numeric = validator.clone("numeric");
var vi_email = validator.clone("email");
var vi_phoneFR = validator.clone("phoneFR");
var vi_required = validator.clone("required");

var vi_password = validator.clone("password");
var vi_passwordConfirm = validator.clone("passwordConfirm");

/******************* Définition des paramètres *******************/

vi_alphanumeric._Conf["regex"] = '^[a-zA-Z0-9àáâãäåçèéêëìíîïğòóôõöùúûüıÿ-]*$';
vi_alphanumeric._Messages["regex"] = 'Ce champ ne doit contenir que des caractères alphanumériques';
vi_alphanumeric._Functions = ['requireRegex'];

vi_alpha._Conf["regex"] = '^[a-zA-Zàáâãäåçèéêëìíîïğòóôõöùúûüıÿ-]*$';
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

vi_password._Conf["regex"] = '[A-Za-zàáâãäåçèéêëìíîïğòóôõöùúûüıÿ-].*[0-9]|[0-9].*[A-Za-zàáâãäåçèéêëìíîïğòóôõöùúûüıÿ-]$';
vi_password._Messages["regex"] = "Le mot de passe doit contenir au moins un chiffre et une lettre";
vi_password._Functions = ['requireRegex'];

vi_passwordConfirm._Messages["equality"] = "Veuillez entrer le même mot de passe";
vi_passwordConfirm._Functions = ['requireEquality'];



var vi_submit = new Object();
vi_submit.process = function(form) {
    alert('lol');
};