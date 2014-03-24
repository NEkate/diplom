var express = require('express'),
    server = express(),
    fs = require('fs'),
    xls = require('node-xlsx'),
    ejs = require('ejs');

server.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + '\\uploads' }));
server.use(express.static(__dirname));

server.post('/csv', function(request, response, nextRoute){
    var file = request.files['xls-file'];

    var data = xls.parse(file.path).worksheets[0].data;

    fs.unlink(file.path);

    var result = {
        dataSource: {
            data: []
        },
        columns: [],
        rowTemplate: ''
    };

    data[0].forEach(function(cell, i){
        result.columns.push({
            field: 'cell' + i,
            title: cell.value || ' '
        });
    });

    data.slice(1).forEach(function(row, i){
        if (!row[0] || !row[0].value) return;

        var cells = {};
        row.forEach(function(cell, j){
            cells['cell' + j] = cell.value;
        });

        result.dataSource.data.push(cells);
    });

    var str = fs.readFileSync('./views/defaultTemplate.html.ejs').toString();

    result.defaultTemplate = ejs.render(str, {length: result.columns.length});

    str = fs.readFileSync('./views/labelTemplate.html.ejs').toString();

    result.labelTemplate = ejs.render(str, {length: result.columns.length});

    response.send(result);
});

server.listen(3030);