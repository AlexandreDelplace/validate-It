($)(function(){
//	application.initForm.process();
	
	$.fn.validateIt = function(conf) {
		console.log(conf);
		var _Form = new Object();
		var _Valid = true;
		var _Tmp_value = new Array();
		
		$('.form').each(function () {
			_Form = $(this);
			$('.formSubmit',$(this)).click(function () {
				$('input:not([type=button]), .form select', _Form).each(function () {
					var valid = true;
					if ($(this).attr('data-form') != null) {
						var el = $(this);
						var data = el.attr('data-form').split(" ");
						for (var x in data) {
							if (valid) {
								var obj = window[data[x].replace(/^\s+|\s+$/g, '')];
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
						var obj = window[data[x].replace(/^\s+|\s+$/g, '')];
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
	
	$(document).validateIt()
});
