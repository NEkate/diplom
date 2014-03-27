define(['table10', 'table11', 'table12', 'results', 'semantic', 'kendo', 'highcharts-export', 'ajax-form'], function (table10, table11, table12, results, $) {

	$('.ui.accordion').accordion();

	$('.ui.checkbox').checkbox();


	var objectsList;

	$('#xlsx-from').ajaxForm({
		success: function (table) {
			objectsList = table.dataSource.data.map(function (item) {
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

			var labelTemplate = kendo.template(table.labelTemplate);
			var defTemplate = kendo.template(table.defaultTemplate);

			var data = $.extend(true, {
				dataSource: {
					data: [],
					pageSize: 10
				},
				pageable: {
					refresh: true,
					pageSizes: true,
					buttonCount: 5
				},
				height: 430,
				scrollable: true,
				sortable: true,
				columns: [],
				rowTemplate: function (row) {
					return row.type === 'label' ? labelTemplate(row) : defTemplate(row);
				}
			}, table);

			$('#grid-title').html(data.file.originalFilename.replace(/\.xlsx$/, ''));

			var grid = $('#input-grid');

			if (grid.data('kendoGrid')) {
				grid.data('kendoGrid').destroy();
				grid.empty();
			}

			grid.kendoGrid(data);

			$('#import-xlsx')
				.closest('.content')
				.next()
				.click()
			;
		}
	});

	//region================ GRIDS ==============================

	$('#input-data-10').kendoGrid({
		dataSource: {
			data: table10,
			pageSize: 10
		},
		pageable: {
			refresh: true,
			pageSizes: true,
			buttonCount: 5
		},
		height: 430,
		scrollable: true,
		sortable: true,
		columns: [
			{field: 'name', title: 'Енергетичні матеріали', headerAttributes: {"class": "table-header"}},
			{field: 'all', title: 'Спожито палива (всього)', headerAttributes: {"class": "table-header"}},
			{field: 'agriculture', title: 'сільське господарство, мисливство та лісове господарство', headerAttributes: {"class": "table-header"}},
			{field: 'industry', title: 'промисловість', headerAttributes: {"class": "table-header"}},
			{field: 'construction', title: 'будівництво', headerAttributes: {"class": "table-header"}},
			{field: 'transport', title: "транспорт і зв'язок", headerAttributes: {"class": "table-header"}},
			{field: 'company', title: 'підприємства і організації інших видів діяльності', headerAttributes: {"class": "table-header"}}

		]
	});
	$('#result-data').kendoGrid({
		dataSource: {
			data: results,
			pageSize: 10
		},
		pageable: {
			refresh: true,
			pageSizes: true,
			buttonCount: 5
		},
		height: 430,
		scrollable: true,
		sortable: true,
		columns: [
			{field: "region", title: "Райони та міста обласного значення", headerAttributes: {"class": "table-header"}},
			{field: "cluster", title: "Кластеризація регіонів", headerAttributes: {"class": "table-header"}}
		]
	});
	$('#cluster-data').kendoGrid({
		dataSource: {
			data: [
				{cluster: 1, cityCount: 1},
				{cluster: 2, cityCount: 1},
				{cluster: 3, cityCount: 2},
				{cluster: 4, cityCount: 5},
				{cluster: 5, cityCount: 9},
				{cluster: 6, cityCount: 8}
			],
			pageSize: 10
		},
		pageable: {
			refresh: true,
			pageSizes: true
		},
		height: 270,
		scrollable: true,
		sortable: true,
		columns: [
			{field: "cluster", title: "Кластер", headerAttributes: {"class": "table-header"}},
			{field: "cityCount", title: "Кількість регіонів", headerAttributes: {"class": "table-header"}}
		]
	});
	$('#data-for-predict').kendoGrid({
		dataSource: {
			data: table11,
			pageSize: 5
		},
		pageable: {
			refresh: true,
			pageSizes: true,
			buttonCount: 5
		},
		height: 270,
		scrollable: true,
		sortable: true,
		columns: [
			{field: "type", title: " ", headerAttributes: {"class": "table-header"}},
			{field: "zero", title: "2000", headerAttributes: {"class": "table-header"}},
			{field: "fife", title: "2005", headerAttributes: {"class": "table-header"}},
			{field: "six", title: "2006", headerAttributes: {"class": "table-header"}},
			{field: "seven", title: "2007", headerAttributes: {"class": "table-header"}},
			{field: "eight", title: "2008", headerAttributes: {"class": "table-header"}},
			{field: "nine", title: "2009", headerAttributes: {"class": "table-header"}}
		]

	});

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

	$('#print-dialog').modal('attach events', '#print', 'show');

	$('#analyze').click(function () {
		var clustersList = [];
		for (var i = 0; i < objectsList.length; i++) {
			var a = objectsList[i];

			for (var j = 0; j < objectsList.length; j++) {
				var b = objectsList[j];

				if (a === b || (a.cluster && b.cluster)) continue;

				var compare = getCompare(a, b); // TODO: create getCompare
				if (compare > -1 && compare < 1) {
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



		goNextContent(this);

		return false;
	});

	function goNextContent(node) {
		$(node)
			.closest('.content')
			.next()
			.click()
		;
	}
});