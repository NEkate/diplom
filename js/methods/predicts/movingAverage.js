define(['methods/utils/clone-object'], function (clone) {

	return function (originObjectList) {
		var objectList = clone(originObjectList, []);
		return objectList.map(function(object){
			return {
				region: object.region,
				predict: object.reduce(function(a, b){
					return a + b;
				}) / object.length
			};

		});
	};
});