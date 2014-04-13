define(['jquery'], function ($) {

	return function(object, type){
		if (typeof type === 'undefined') {
			type = {};
		}

		return $.extend(true, type, object);
	};
});