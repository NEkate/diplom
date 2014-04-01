define(['knockout', 'semantic', 'kendo', 'highcharts-export', 'ajax-form'], function ( knockout, $) {

	$('.ui.accordion').accordion();

	$('.ui.checkbox').checkbox();


	var originalObjectsList,
		originalTable;

	$('#xlsx-from').ajaxForm({
		success: function (table) {
			originalTable = table;
			originalObjectsList = table.dataSource.data.map(function (item) {
				var object = [];

				object.region = item.cell0;
				for (var name in item) {
					if (!item.hasOwnProperty(name) || name === 'cell0') {
						continue;
					}

					object.push(item[name]);
				}

				return object;
			});

			$('#grid-title').html(table.file.originalFilename.replace(/\.xlsx$/, ''));

			var grid = $('#input-grid');

			if (grid.data('kendoGrid')) {
				grid.data('kendoGrid').destroy();
				grid.empty();
			}

			createTable('#input-grid', table.dataSource.data, table.columns);

			goNextContent('#import-xlsx');
		}
	});

	$('#analyze').submit(function (e) {
		e.preventDefault();

		var objectList = $.extend(true, [], originalObjectsList),
			clustersList = [],
			singleClustersList = [],
			factor = parseFloat($('#factor').val());
		for (var i = 0; i < objectList.length; i++) {
			var a = objectList[i];

			for (var j = 0; j < objectList.length; j++) {
				var b = objectList[j];

				if (a === b || (a.cluster && b.cluster)) continue;

				var compare = getCompare(a, b);
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

		clustersView.removeAll();
		for (i = 0; i < clustersList.length; i++){
			for (j = 0; j < clustersList[i].length; j++){
				clustersList[i][j].clusterIndex = i + 1;
			}

			clustersView.push(clustersList[i]);
		}

		var data = [];
		for (i = 0;  i < clustersList.length; i++){
			data = data.concat(clustersList[i]);
		}

		var columns = originalTable.columns.concat([{
			field: 'clusterIndex',
			title: 'Номер кластеру'
		}]);

		var _data = data.map(function(item){
			var arr = $.extend([], item);
			arr.splice(0, 0, item.region);
			arr.push(item.clusterIndex);
			return arr;
		});

		_data.splice(0, 0, columns.map(function(item){
		    return item.title;
		}));

		$('#export-data').val(JSON.stringify(_data));

		data = data.map(function(item){
			var object = {
				cell0:        item.region,
				clusterIndex: item.clusterIndex
			};

			for (j = 0;  j < item.length; j++){
				object['cell' + (j + 1)] = item[j];
			}

			return object;
		});

		createTable('#result-data', data, columns);

		goNextContent(this);

		return false;
	});

	//region ===================== Utils ===================================

	function goNextContent(node) {
		$(node)
			.closest('.content')
			.next()
			.click()
		;
	}

	function getCompare(a, b) {
		var middleA = a.reduce(function(sum, x){return sum + x;}) / a.length;
		var middleB = b.reduce(function(sum, x){return sum + x;}) / b.length;

		var sum = 0,
			sumA = 0,
			sumB = 0;
		for (var i = 0; i < a.length; i++) {
			var x = (a[i] - middleA);
			var y = (b[i] - middleB);
			sum += x * y;
			sumA += x * x;
			sumB += y * y;
		}

		return sum / Math.sqrt(sumA * sumB);
	}

	function createTable(selector, data, colomns){
		$(selector).kendoGrid({
			dataSource: {
				data: data,
				pageSize: 20
			},
			pageable: {
				refresh: true,
				pageSizes: true,
				buttonCount: 5
			},
			height: 600,
			scrollable: true,
			sortable: true,
			columns: colomns
		});
	}

	//endregion

	var clustersView = knockout.observableArray();

	knockout.applyBindings({clusters: clustersView}, $('#clusters-result')[0]);
});