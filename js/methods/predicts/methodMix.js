define([
	'methods/predicts/exponentialSmoothing',
	'methods/predicts/movingAverage'
], function (
	exponentialSmoothing,
	movingAverage
) {

	return function(options){
		var a = exponentialSmoothing(options.objectList, options.alpha),
			bHash = movingAverage(options.objectList).reduce(function(x, y){
				x[y.region] = y.predict;
				return x;
			},{});
	    return a.map(function(object){
	        var ai = object.predict,
				bi = bHash[object.region];

			return ai * 0.6 + bi * 0.4;
	    });
	}
});