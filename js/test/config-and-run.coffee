require.config
    baseUrl: 'js/'
    paths:
       jquery: 'lib/jquery/jquery.min'
       chai: 'lib/chai/chai'
       mocha: 'lib/mocha/mocha'
    shim:
        mocha:
            exports: 'mocha'
        jquery:
            exports: 'jQuery'

tests = [
    'methods/rankAnalyse'
    'methods/closest-neighbours'
    'methods/k-means'
    'methods/methodMix'
#    'methods/predicts/methodMix'
]

tests = tests.map (test) -> 'test/' + test

require ['mocha'], (mocha) ->
    mocha.setup 'bdd'
    require tests, ->
        mocha.run()
