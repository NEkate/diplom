define(['methods/utils/clone-object'], function (clone) {
	return function(originObjectList, alpha){
		var objectList = clone(originObjectList, []);
		return objectList.map(function(object){
			var current = object.slice(-1)[0],
				past = object.slice(-2)[0];
		    return {
				region: object.region,
				predict: alpha * current + (1 - alpha) * past
			};
		});

	};
});