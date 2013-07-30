($)(function(){
	$.fn.validateIt = function(param) {
		var _Form = new Object();
		var _Valid = true;
		var _Tmp_value = new Array();
		
		validatorCreation(param);
		
		$('.form').each(function () {
			//_Valid = true;
			_Form = $(this);
			$('.formSubmit',$(this)).click(function () {
				$('input:not([type=button]), .form select', _Form).each(function () {
					var valid = true;
					if ($(this).attr('data-form') != null) {
						var el = $(this);
						var data = el.attr('data-form').split(" ");
						for (var x in data) {
							if (valid) {
								var obj = window['vi_' + data[x].replace(/^\s+|\s+$/g, '')];
								if (typeof obj == "object") {
									if (typeof obj.process == "function") {
										switch(obj._Name) {
											case 'password':
												_Tmp_value['password'] = el.val();
												break;
											case 'passwordConfirm':
												passwordConfirm._Conf_equality =_Tmp_value['password'];
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
				if (_Valid) _Form.submit();
			});
		});
		$('input:not([type=button]), .form select', _Form).on('blur keyup', function () {
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
	}
	
	validatorCreation = function (param) {
		for(var name in param) {
			window[name] = validator.clone(name);
			var obj = window[name];
			for(var fct in param[name]) {
				obj._Functions.push("require" + fct[0].toUpperCase() + fct.slice(1));
				//obj.eval("_Message_" + fct) = fct.message;
			}
			console.log(obj);
		}
	}
	
	$(document).validateIt({
		"lol" : {
			regex : {
				conf : "",
				message: ""
			},
			field : {
				message: ""
			},
			optionnalTest : function(self) {
				
			}
		}
	});
});

