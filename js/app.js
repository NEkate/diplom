define([
	'methods/utils/clone-object',
	'methods/utils/data-normalization',
	'methods/rankAnalyse',
	'methods/closest-neighbours',
	'methods/k-means',
	'methods/methodMix',
	'methods/predicts/methodMix',
	'knockout',
	'jquery', 'semantic', 'kendo', 'highcharts-export', 'ajax-form'
], function (
	clone,
	dataNormalization,
	rankAnalyse,
	closestNeighbours,
	kMeans,
	methodsMix,
	predict,
	knockout,
	$) {

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


	$('a.button').click(function () {
		$(this.getAttribute('href')).data('chart').exportChart();
	});


	$('#show-settings').click(function () {
		goNextContent($('#show-settings'));
	});

	$('#analyse').submit(function (e) {
		e.preventDefault();

		var i, j;

		//region ===================== rank analyse

		if (analyzeView.rang()) {

			var averageList = rankAnalyse(dataNormalization(originalObjectsList));

			createChart(
				'#rank-chart',
				[
					{
						data: averageList.map(function (object) {
							return {
								name: object.region,
								y: object.averageValue
							};
						})
					}
				],
				{
					title: 'Ранговый анализ',
					oXLabels: averageList.map(function (object) {
						return averageList.indexOf(object) + 1;
					})
				}
			);
		}
		//endregion

		//region ===================== cluster analyse
		if (analyzeView.cluster()) {

			var clustersList = getClusterList(analyzeView.method());

			function getClusterList(methodName) {
				var objectList = dataNormalization(originalObjectsList);
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
							factor: parseFloat($('#methods-mix-factor').val()),
							objectList: objectList,
							counter: 1
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
		}
		//endregion

		//region ===================== predict

		if (analyzeView.predict()){
			var predictList = predict({
					objectList: originalObjectsList,
					alpha: 0.9
				}),
				predictData = predictList.map(function(object){
				    return {
						cell0: object.region,
						cell1: object.movingAveragePredict.toFixed(4),
						cell2: object.exponentialSmoothingPredict.toFixed(4),
						cell3: object.predict.toFixed(4)
					};
				}),
				predictColumns = [
					{
						field: 'cell0',
						title: ' '
					},
					{
						field: 'cell1',
						title: 'Середня ковзаюча'
					},
					{
						field: 'cell2',
						title: 'Експоненційне згладжування'
					},
					{
						field: 'cell3',
						title: 'Прогнозоване значення'
					}
				];

			createTable('#predict-grid', predictData, predictColumns);
		}
		//endregion

		goNextContent(this);

		return false;
	});

	//region ===================== Utils

	function goNextContent(node) {
		$(node)
			.closest('.content')
			.next()
			.click()
		;
	}

	function createTable(selector, data, colomns) {
		var grid = $(selector);
		if(grid.data('kendoGrid')){
			grid.data('kendoGrid').destroy();
			grid.empty();
		}

		grid.kendoGrid({
			dataSource: {
				data: data,
				pageSize: 10
			},
			pageable: {
				refresh: true,
				pageSizes: true,
				buttonCount: 5
			},
			height: 400,
			scrollable: true,
			sortable: true,
			columns: colomns
		});
	}

	function createChart(selector, data, options) {
		$(selector).highcharts({
			title: {
				text: options.title
			},
			xAxis: {
				categories: options.oXLabels,
				allowDecimals: false
			},
			yAxis: {
				title: {
					text: options.oYTitle
				},
				min: 0
			},
			tooltip: {
				formatter: function () {
					return 'регион: ' + this.point.name + '<br/>енергоспоживання: ' + this.y.toFixed(4);
				}
			},
			legend: {
				enabled: false
			},
			credits: {
				enabled: false
			},
			series: data
		});
	}

	//endregion

	var clustersView = knockout.observableArray();


	var analyzeView = {
		method: knockout.observable('methods-mix'),
		range: knockout.observable(true),
		rang: knockout.observable(true),
		cluster: knockout.observable(true),
		predict: knockout.observable(true),
		clusters: clustersView
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


	analyzeView.isDisabled = knockout.computed(function () {
		if (
			(analyzeView.range() ||
				analyzeView.rang() ||
				analyzeView.predict())
				&& !analyzeView.cluster()
			) {
			return false;
		}
		else if (
			analyzeView.cluster()
				&&
				analyzeView.method() !== ''
			) {
			return false;
		}
		else {
			return true;
		}
	});

	$('#clusterization-method').dropdown({
		onChange: function (value) {
			analyzeView.method(value);
		}
	});

	knockout.applyBindings(analyzeView, $('body')[0]);
});