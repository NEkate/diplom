define(['methods/utils/clone-object'], function (clone) {

	return function(originObjectList){
		var objectList = clone(originObjectList, []);
		var averageList = objectList.map(function(object){
		    return {
				region: object.region,
				averageValue: object.reduce(function(a, b){
				    return a + b;
				}) / object.length
			};
		});

		return averageList.sort(function(a, b){
		    return a.averageValue > b.averageValue ? -1 : (a.averageValue < b.averageValue ? 1 : 0);
		});
	};

});
