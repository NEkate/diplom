define(['table10', 'table11','table12', 'table13', 'results', 'semantic', 'kendo', 'highcharts-export', 'fineuploader'], function(table10, table11, table12, table13, results, $){

    $('.ui.accordion').accordion();

    $('.ui.checkbox').checkbox();

    var uploader = $('#fine-uploader').createFineUploader({
        multiple:   false,
        autoUpload: false,
        request: {
            endpoint: '/dialer/uploadFile'
        },
        validation: {
            allowedExtensions: ['csv']
        },
        callbacks: {
            onValidate: function(){
                $('.import').prop('disabled', false);
            },
            onProgress: function(id, file, uploaded, total){
                $('#progress').css('width', uploaded * 100 / total + '%');
            },
            onComplete: function(id, file, response){

            }
        }
    });

    var importButton = $('.import').click(function(){
//        importButton.prop('disabled', true);
//        uploader.uploadStoredFiles();
        importButton
            .closest('.content')
            .next()
            .click()
        ;

        return false;
    });

//region======================= GRIDS ==============================
    $('#input-data-13').kendoGrid({
        dataSource: {
            data: table13,
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
            {field: "coal", title: "Вугілля кам’яне,&nbsp;т", headerAttributes: {"class": "table-header"}},
            {field: "blocks", title: "Брикети, окатиші,&nbsp;т", headerAttributes: {"class": "table-header"}},
            {field: "natural_gas", title: "Газ природний, тис.&nbsp;куб.&nbsp;м", headerAttributes: {"class": "table-header"}},
            {field: "gasoline", title: "Бензин моторний,&nbsp;т", headerAttributes: {"class": "table-header"}},
            {field: "gas", title: "Газойлі(паливо дизельне),&nbsp;т", headerAttributes: {"class": "table-header"}},
            {field: "diesel", title: "Мазути топкові важкі,&nbsp;т", headerAttributes: {"class": "table-header"}},
            {field: "oil", title: "Дрова для опалення, щільн.м3", headerAttributes: {"class": "table-header"}}
        ]
    });
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
            {field: 'industry', title:'промисловість', headerAttributes: {"class": "table-header"}},
            {field: 'construction', title:'будівництво', headerAttributes: {"class": "table-header"}},
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
        dataSource:{
            data: table11,
            pageSize:5
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

    $('#chart-1').each(function(){
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
            series: [{
                name: 'Кластери',
                data: [1, 1, 2, 5, 9, 8]

            }]
        });

        $(this).data('chart', chart);
    });

    $('a.button').click(function(){
        $(this.getAttribute('href')).data('chart').exportChart();
    });

    $('#print-dialog').modal('attach events', '#print', 'show');

    var analyzeButton = $('.analyze').click(function(){
        analyzeButton
            .closest('.content')
            .next()
            .click()
        ;
        return false;
    });
});