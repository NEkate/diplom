define([
	'methods/utils/clone-object',
	'methods/utils/data-normalization',
	'methods/closest-neighbours',
	'methods/k-means',
	'methods/methodMix',
	'knockout',
	'jquery', 'jqueryui', 'semantic', 'kendo', 'highcharts-export', 'ajax-form'
], function (
	clone,
	dataNormalization,
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



	$('a.button').click(function () {
		$(this.getAttribute('href')).data('chart').exportChart();
	});

	var settingsDialog = $('#settings-dialog').dialog({
		width: 700,
		minHeight: 360,
		title: "Налаштування для аналізу",
		autoOpen: false,
		modal: true
	});

	$('#show-settings').click(function(){
		settingsDialog.dialog('open');
	});

	$('#analyse').submit(function (e) {
		e.preventDefault();

		settingsDialog.dialog('close');

		var i, j;

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

		goNextContent($('#show-settings'));

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
				pageSize: 30
			},
			pageable: {
				refresh: true,
				pageSizes: true,
				buttonCount: 5
			},
			height: 1000,
			scrollable: true,
			sortable: true,
			columns: colomns
		});
	}

	//endregion

	var clustersView = knockout.observableArray();

	knockout.applyBindings({clusters: clustersView}, $('#clusters-result')[0]);

	var analyzeView = {
		method: knockout.observable('methods-mix'),
		range: knockout.observable(true),
		rang: knockout.observable(true),
		cluster: knockout.observable(true),
		predict: knockout.observable(true)
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
			&&
			! analyzeView.cluster()
			){
			return false;
		}
		else if(
			analyzeView.cluster()
			&&
			analyzeView.method() !== ''
			){
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

	knockout.applyBindings(analyzeView, $('#settings-dialog')[0]);
});