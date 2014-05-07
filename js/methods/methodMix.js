define(['methods/utils/clone-object', 'methods/closest-neighbours', 'methods/k-means'], function (clone, closestNeighbours, kMeans) {

	return function methodMix(options){
		var objectList = clone(options.objectList, []),
			factor = options.factor,
			counter = options.counter;

		var list = closestNeighbours(objectList, factor);

		if (list.length === 1) {
			list.forEach(function(cluster){
				cluster.forEach(function(item){
					item.clusterIndex = counter;
				});
			});
			return list;
		}

		var methodsList = [list];

		methodsList.push(kMeans(objectList, factor, list.length, true));

		var objectsIndexesHash = {};

		methodsList.forEach(function(clusterList){
		    clusterList.forEach(function(cluster){
		        cluster.forEach(function(object){
		            if ( !objectsIndexesHash.hasOwnProperty(object.region) ){
						objectsIndexesHash[object.region] = [];
					}

					objectsIndexesHash[object.region].push(object.clusterIndex);
		        })
		    })
		});

		var regionsList = [];

		for (var region in objectsIndexesHash){
			if (!objectsIndexesHash.hasOwnProperty(region)) continue;

			regionsList.push({
				region: region,
				indexes: objectsIndexesHash[region].join(',')
			});
		}

		regionsList = regionsList.sort(function(a, b){
		    return a.indexes.localeCompare(b.indexes);
		});

		var clusterRegionListHash = {};

		regionsList.reduce(function(a, b){
		    if (a.indexes === b.indexes) {
				if (a.hasOwnProperty('cluster')) {
					b.cluster = a.cluster;
				}
				else {
					a.cluster = counter;
					b.cluster = counter;
					counter++;
				}

				if ( !clusterRegionListHash.hasOwnProperty(a.cluster)){
					clusterRegionListHash[a.cluster] = [a, b];
				}
				else{
					clusterRegionListHash[a.cluster].push(b);
				}
			}

			return b;
		});

		var restRegions = regionsList.filter(function(region){
		    return ! region.hasOwnProperty('cluster');
		});

		var clusterList = [],
			objectListHash = {};

		objectList.forEach(function(item){
		    objectListHash[item.region] = item;
		});

		for (var cluster in clusterRegionListHash){
			if (!clusterRegionListHash.hasOwnProperty(cluster)) continue;

			clusterList.push(clusterRegionListHash[cluster].map(function(item){
			    var object = objectListHash[item.region];
				object.clusterIndex = item.cluster;
				return object;
			}));
		}

		var restObjects = restRegions.map(function(item){
			var object = objectListHash[item.region];
			object.clusterIndex = counter;
			return object;
		});

		if (clusterList.length === 0){
			return restObjects;
		}
		var customs = {
			factor: factor,
			objectList: restObjects,
			counter: counter
		};
		clusterList = clusterList.concat(methodMix(customs));

		return clusterList;
	};

});