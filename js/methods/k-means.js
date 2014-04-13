define(['methods/utils/clone-object', 'methods/utils/addIndex', 'methods/utils/correlation-coefficient'], function (clone, addIndex, getCorrelationCoefficient) {

	return function kMeans(originObjectList, factor, K, checkK){
		var objectList = clone(originObjectList, []);

		var distanceList = [],
			i, j;

		for(i = 0; i < objectList.length; i++) {
			for(j = i + 1; j <objectList.length; j++) {
				var cluster = [objectList[i], objectList[j]];
				cluster.ditance = getDistance(objectList[i], objectList[j]);
				distanceList.push(cluster);
			}
		}

		distanceList = distanceList.sort(function(a, b){
			return a.distance < b.distance ? -1 : (a.distance > b.distance ? 1 : 0);
		});

		var firstKObjects = [];
		Array.prototype.concat.apply([], distanceList.reverse()).forEach(function(object){
		    if (firstKObjects.indexOf(object) > -1 || firstKObjects.length === K) return;

			firstKObjects.push(object);
		});

		var freeObjectList = objectList.filter(function(object){
		    return firstKObjects.indexOf(object) === -1;
		});

		var clusterList = firstKObjects.map(function(object){
		    var cluster = [object];
			cluster.centroid = getCentroid(cluster);
			return cluster;
		});

		do {
			var countOfAddedObjects = 0;

			clusterList.forEach(function(cluster){
				freeObjectList.forEach(function(object, i){
					if (getCorrelationCoefficient(cluster.centroid, object) > factor) {
						cluster.push(object);
						freeObjectList.splice(i, 1);
						countOfAddedObjects++;
					}
				});
			});

		} while(countOfAddedObjects > 0 && freeObjectList.length > 0);

		if (freeObjectList.length > 0) {
			clusterList.push(freeObjectList);
		}

		addIndex(clusterList);

		if (checkK && clusterList.length > K) {
			return kMeans(originObjectList, factor, K - 1, false);
		}

		return clusterList;
	};
//region ===================== UTILS =====================
	function getDistance(a, b){
	    var sum = 0;
		for(var i = 0; i < a.length; i++){
			sum += Math.pow(a[i] - b[i], 2);
		}

		return Math.sqrt(sum);
	}

	function getCentroid(cluster){
		var rows = cluster.length,
			columns = cluster[0].length,
			centroid = createZeroArray(columns);
		for(var i = 0; i < columns; i++){
			for(var j = 0; j < rows; j++) {
				centroid[i] += cluster[j][i] / rows;
			}
		}
		return centroid;
	}

	function createZeroArray(n){
		var array = [];
		for (var i = 0; i < n; i++ ) {
			array.push(0);
		}
		return array;
	}
//endregion
});