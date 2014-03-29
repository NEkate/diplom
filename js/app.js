define(['table10', 'table11', 'knockout', 'semantic', 'kendo', 'highcharts-export', 'ajax-form'], function (table10, table11, knockout, $) {

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

	//region================ GRIDS ==============================
	createTable('#input-data-10', table10, [
		{field: 'name', title: 'Енергетичні матеріали', headerAttributes: {"class": "table-header"}},
		{field: 'all', title: 'Спожито палива (всього)', headerAttributes: {"class": "table-header"}},
		{field: 'agriculture', title: 'сільське господарство, мисливство та лісове господарство', headerAttributes: {"class": "table-header"}},
		{field: 'industry', title: 'промисловість', headerAttributes: {"class": "table-header"}},
		{field: 'construction', title: 'будівництво', headerAttributes: {"class": "table-header"}},
		{field: 'transport', title: "транспорт і зв'язок", headerAttributes: {"class": "table-header"}},
		{field: 'company', title: 'підприємства і організації інших видів діяльності', headerAttributes: {"class": "table-header"}}
	]);

	createTable('#data-for-predict',table11,[
		{field: "type", title: " ", headerAttributes: {"class": "table-header"}},
		{field: "zero", title: "2000", headerAttributes: {"class": "table-header"}},
		{field: "fife", title: "2005", headerAttributes: {"class": "table-header"}},
		{field: "six", title: "2006", headerAttributes: {"class": "table-header"}},
		{field: "seven", title: "2007", headerAttributes: {"class": "table-header"}},
		{field: "eight", title: "2008", headerAttributes: {"class": "table-header"}},
		{field: "nine", title: "2009", headerAttributes: {"class": "table-header"}}
	]);

	//endregion

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

		var objectList = $.extend(true, [], originalObjectsList),
			clustersList = [],
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
				var cluster = [a];
				a.cluster = cluster;
				clustersList.push(cluster);
			}
		}

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