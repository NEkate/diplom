var express = require('express'),
    server = express(),
    fs = require('fs'),
    xlsx = require('node-xlsx'),
    ejs = require('ejs');

server.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + '\\uploads' }));
server.use(express.static(__dirname));

server.post('/xlsx', function(request, response, nextRoute){
    var file = request.files['xlsx-file'];

    var data = xlsx.parse(file.path).worksheets[0].data;

    fs.unlink(file.path);

    var result = {
        dataSource: {
            data: []
        },
        columns: []
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
            cells['cell' + j] = toInt(cell.value);
        });

        result.dataSource.data.push(cells);
    });

    result.file = file;

    response.send(result);
});

server.post('/export-xlsx', function(request, response){
    var data = JSON.parse(request.param('export-data'));

	var buffer = xlsx.build({worksheets: [
		{"name":"Cluster", "data": data}
	]});


	response.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	response.set("Content-Disposition", "attachment;filename=cluster.xlsx");
	response.send(buffer);
});

server.listen(80);


function toInt(val){
    if (typeof val === 'string' && val.match(/^\d+,\d+$/)) {
		return parseFloat(val.replace(',', '.'));
	}

	return val;
}