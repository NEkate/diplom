define(['methods/utils/clone-object', 'methods/utils/addIndex', 'methods/utils/correlation-coefficient'], function (clone, addIndex, getCorrelationCoefficient) {

	return function closestNeighbours(objectList, factor){
		objectList = clone(objectList, []);

		var clustersList = [],
			singleClustersList = [];
		for (var i = 0; i < objectList.length; i++) {
			var a = objectList[i];

			for (var j = 0; j < objectList.length; j++) {
				var b = objectList[j];

				if (a === b || (a.cluster && b.cluster)) continue;

				var compare = getCorrelationCoefficient(a, b);
				if (compare > factor && compare <= 1) {
					if (a.cluster && !b.cluster) {
						a.cluster.push(b);
						b.cluster = a.cluster;
					}
					else if (!a.cluster && b.cluster) {
						b.cluster.push(a);
						a.cluster = b.cluster;
					}
					else {
						var cluster = [a, b];
						a.cluster = cluster;
						b.cluster = cluster;
						clustersList.push(cluster);
					}
				}
			}

			if (!a.cluster) {
				a.cluster = singleClustersList;
				singleClustersList.push(a);
			}
		}

		clustersList.push(singleClustersList);

		addIndex(clustersList);

		return clustersList;
	};

});