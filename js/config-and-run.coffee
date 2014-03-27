require.config
    baseUrl: 'js/'
    paths:
        jquery: 'lib/jquery/jquery.min'
        semantic: 'lib/semantic/build/packaged/javascript/semantic'
        kendo: 'lib/kendo-ui/js/kendo.web.min'
        highcharts: 'lib/highcharts.com/js/highcharts.src'
        "highcharts-export": 'lib/highcharts.com/js/modules/exporting.src'
        fineuploader: 'lib/fineuploader'
        'ajax-form': 'lib/jquery.form.min'

    shim:
        jquery:
            exports: 'jQuery'
        semantic:
            deps: ['jquery']
            exports: 'jQuery'
        kendo:
            deps: ['jquery']
            exports: 'jQuery'
        highcharts:
            deps: ['jquery']
            exports: 'jQuery'
        "highcharts-export":
            deps: ['jquery', 'highcharts']
            exports: 'jQuery'
        fineuploader:
            deps: ['jquery']
            exports: 'jQuery'
        'ajax-form':
            deps: ['jquery']
            exports: 'jQuery'


require ['app']
