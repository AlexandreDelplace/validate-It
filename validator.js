// Classe "abstraite" de validation
var validator = {
    // Paramètres du champs testé
    _Name: "",
    _Value: null,
    _Message: "",
    _Valid: true,

    // Liste des fonctions prédéfinies (sous forme de chaîne) à exécuter sur le champs
    _Functions: [],

    // Messages d'erreur des tests prédéfinis
    _Message_maxLength: "Ce champ possède trop de caractères",
    _Message_minLength: "Ce champ ne possède pas assez de caractères",
    _Message_regex: "Ce champ n'est pas sous le bon format",
    _Message_require: "Veuillez remplir ce champ",
    _Message_mismatch: "Ce champ n'est pas correct",
    _Message_equality: "Ce champ n'est pas correct",

    // Configurations par défaut des test
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
        this.optionalTest(this);
    },
    optionalTest: function (self) {
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

var alphanumeric = validator.clone("alphanumeric");
var alpha = validator.clone("alpha");
var numeric = validator.clone("numeric");
var email = validator.clone("email");
var phoneFR = validator.clone("phoneFR");
var required = validator.clone("required");

var password = validator.clone("password");
var passwordConfirm = validator.clone("passwordConfirm");

/******************* Définition des paramètres *******************/

alphanumeric._Conf_regex = '^[a-zA-Z0-9àáâãäåçèéêëìíîïğòóôõöùúûüıÿ-]*$';
alphanumeric._Message_regex = 'Ce champ ne doit contenir que des caractères alphanumériques';
alphanumeric._Functions = ['requireRegex'];

alpha._Conf_regex = '^[a-zA-Zàáâãäåçèéêëìíîïğòóôõöùúûüıÿ-]*$';
alpha._Message_regex = 'Ce champ ne doit contenir que des caractères alphabétiques';
alpha._Functions = ['requireRegex'];

numeric._Conf_regex = '^[0-9]*$';
numeric._Message_regex = 'Ce champ ne doit contenir que des caractères numériques';
numeric._Functions = ['requireRegex'];

email._Conf_regex = '^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$';
email._Message_regex = 'Veuillez entrer un adresse email valide';
email._Functions = ['requireRegex'];

phoneFR._Conf_regex = '^[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}$';
phoneFR._Message_regex = 'Veuillez entrer un numéro de téléphone valide';
phoneFR._Functions = ['requireRegex'];

required._Functions = ['requireField'];

password._Conf_regex = '[A-Za-zàáâãäåçèéêëìíîïğòóôõöùúûüıÿ-].*[0-9]|[0-9].*[A-Za-zàáâãäåçèéêëìíîïğòóôõöùúûüıÿ-]$';
password._Message_regex = "Le mot de passe doit contenir au moins un chiffre et une lettre";
password._Functions = ['requireRegex'];

passwordConfirm._Message_equality = "Veuillez entrer le même mot de passe";
passwordConfirm._Functions = ['requireEquality'];

