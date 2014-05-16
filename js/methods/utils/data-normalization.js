define(['methods/utils/clone-object'], function (clone) {

	return function (originObjectList) {

		var objectsList = clone(originObjectList, []);
		return objectsList.map(function (object) {
			var min = object.reduce(function (a, b) {
					return a < b ? a : b;
				}),
				max = object.reduce(function (a, b) {
					return a > b ? a : b;
				});

			var normalizeObject = object.map(function(cell){

			     return round((cell - min) / (max - min));
			});

			normalizeObject.region = object.region;

			return normalizeObject;
		});

	}


	function round(number){
	    return parseFloat(number.toFixed(4));
	}
});