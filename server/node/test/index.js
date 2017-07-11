/**
 * Created by tianzx on 2017/7/10.
 */

var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
    fs.readFile(__dirname + '/testdata.md', function (err, data) {
        res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
        res.end(data);
    });
});

server.listen(8000);