define([], function(){
	return function(clustersList){
		for (var i = 0; i < clustersList.length; i++){
			for (var j = 0; j < clustersList[i].length; j++){
				clustersList[i][j].clusterIndex = i + 1;
			}
		}
	}
});
