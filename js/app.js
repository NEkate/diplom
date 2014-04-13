define([
	'methods/utils/clone-object',
	'methods/closest-neighbours',
	'methods/k-means',
	'methods/methodMix',
	'knockout',
	'jquery', 'semantic', 'kendo', 'highcharts-export', 'ajax-form'
], function (
	clone,
	closestNeighbours,
	kMeans,
	methodsMix,
	knockout,
	$
) {

	$('.ui.accordion').accordion();

	$('.ui.checkbox').checkbox();

	var originalObjectsList,
		originalTable;

	$('#xlsx-from').ajaxForm({
		success: function (table) {
			if (typeof table !== 'object') {
				alert('Server error');
				return;
			}

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
		},
		error: function () {
			alert('Server error!');
		}
	});

	$('#chart-1').each(function () {
		var chart = new Highcharts.Chart({
			chart: {
				type: 'column',
				renderTo: this
			},
			title: {
				text: 'Кількість міст у кожному з кластерів'
			},
			xAxis: {
				categories: [
					1, 2, 3, 4, 5, 6
				]
			},
			yAxis: {
				min: 0,
				title: {
					text: 'Кількість міст'
				},
				allowDecimals: false
			},
			plotOptions: {
				column: {
					pointPadding: 0.2,
					borderWidth: 0
				}
			},
			series: [
				{
					name: 'Кластери',
					data: [1, 1, 2, 5, 9, 8]

				}
			]
		});

		$(this).data('chart', chart);
	});

	$('a.button').click(function () {
		$(this.getAttribute('href')).data('chart').exportChart();
	});

	//$('#print-dialog').modal('attach events', '#print', 'show');

	$('#analyze').submit(function (e) {
		e.preventDefault();

		var i, j;

		var clustersList = getClusterList(analyzeView.method());

		function getClusterList(methodName) {
			var objectList = clone(originalObjectsList, []);
			var clustersList = null;

			switch (methodName) {
				case 'closest-neighbours':
					clustersList = closestNeighbours(objectList, parseFloat($('#closest-neighbours-factor').val()));
					break;

				case 'k-means':
					var K = parseInt($('#number-of-clusters').val()),
						factor = parseFloat($('#k-means-factor').val());

					clustersList = kMeans(objectList, factor, K, true);
					break;

				case 'methods-mix':
					clustersList = methodsMix({
						factor: parseFloat($('#closest-neighbours-factor').val()),
						objectList: objectList,
						counter: 0
					});

					break;
			}

			return clustersList;
		}

		clustersView.removeAll();
		for (i = 0; i < clustersList.length; i++) {
			clustersView.push(clustersList[i]);
		}

		var data = [];
		for (i = 0; i < clustersList.length; i++) {
			data = data.concat(clustersList[i]);
		}

		var columns = originalTable.columns.concat([
			{
				field: 'clusterIndex',
				title: 'Номер кластеру'
			}
		]);

		var _data = data.map(function (item) {
			var arr = $.extend([], item);
			arr.splice(0, 0, item.region);
			arr.push(item.clusterIndex);
			return arr;
		});

		_data.splice(0, 0, columns.map(function (item) {
			return item.title;
		}));

		$('#export-data').val(JSON.stringify(_data));

		data = data.map(function (item) {
			var object = {
				cell0: item.region,
				clusterIndex: item.clusterIndex
			};

			for (j = 0; j < item.length; j++) {
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

	function createTable(selector, data, colomns) {
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

	var analyzeView = {
		method: knockout.observable('')
	};

	analyzeView.isClosestNeighbours = knockout.computed(function () {
		return analyzeView.method() === 'closest-neighbours';
	});

	analyzeView.isKMeans = knockout.computed(function () {
		return analyzeView.method() === 'k-means';
	});

	analyzeView.isMethodsMix = knockout.computed(function () {
		return analyzeView.method() === 'methods-mix';
	});

	analyzeView.methodNotSet = knockout.computed(function () {
		return analyzeView.method() === '';
	});

	$('#clusterization-method').dropdown({
		onChange: function (value) {
			analyzeView.method(value);
		}
	});

	knockout.applyBindings(analyzeView, $('#analyze')[0]);
});