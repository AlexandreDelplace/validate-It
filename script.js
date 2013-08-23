($)(function() {
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
		message: "Le prénom ne peut étre égal à Jean ou Bernard"
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
	},
	group: {
	    test: function(self) {
		console.log(self);
		console.log(self._Value);
	    }
	},
	submit: function(form) {
	    console.log(form);
	}
    });

    $('.form2').validateIt();
});